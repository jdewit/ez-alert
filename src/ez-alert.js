'use_strict';

angular.module('ez.alert', [])

.constant('EzAlertConfig', {
  successClass: 'alert alert-success',
  warningClass: 'alert alert-warning',
  errorClass: 'alert alert-danger',
  delay: 8000,
  maxAlerts: 5,
  insertFirst: true // insert the alert into the first position of the array. Else insert last
})

.directive('ezAlert', ['EzAlert', function(EzAlert) {
  return {
    restrict: 'EA',
    templateUrl: 'ez-alert-tpl.html',
    link: function(scope) {
      scope.$watch(EzAlert.get, function() {
        scope.alerts = EzAlert.get();

        /*scope.$watch('alerts', function(newVal, oldVal) {
          if (newVal !== oldVal) {
            console.log(newVal);
          }
        }, true);*/
      });

      scope.hideAlert = function(index) {
        EzAlert.hide(EzAlert, scope.alerts[index], 0);
      };
    }
  };
}])

.service('EzAlert', ['$interval', 'EzAlertConfig', function($interval, EzAlertConfig) {
  var alerts = [];

  return {
    clear: function() {
      alerts = [];
    },
    get: function() {
      return alerts;
    },
    error: function(msg, noClear) {
      this.add('error', msg, noClear);
    },
    warning: function(msg, noClear) {
      this.add('warning', msg, noClear);
    },
    success: function(msg, noClear) {
      this.add('success', msg, noClear);
    },
    add: function(type, msg, noClear) {
      var alertItem = {
        alertClass: EzAlertConfig[type + 'Class'],
        msg: msg
      };

      var duplicateFound = this.findDuplicates(alertItem);

      if (!!duplicateFound) {
        return;
      }

      alertItem.showPromise = $interval(function() {
        alertItem.show = true;
      }, 1, 1);

      this.hideExcessAlerts(this);

      if (EzAlertConfig.insertFirst) {
        alerts.unshift(alertItem);
      } else {
        alerts.push(alertItem);
      }

      if (!noClear) {
        this.hide(this, alertItem, EzAlertConfig.delay);
      }
    },
    findDuplicates: function(newAlert) {
      var that = this;

      for (var i = 0, l = alerts.length; i < l; i++) {
        var alertItem = alerts[i];

        if (alertItem.alertClass === newAlert.alertClass && alertItem.msg === newAlert.msg) {
          that.hideAndShow(alertItem);

          return true;
        }
      }

      return false;
    },
    hideExcessAlerts: function(that) {
      if (alerts.length >= EzAlertConfig.maxAlerts) {
        var excessCount = alerts.length - EzAlertConfig.maxAlerts + 1;

        for (var i = 0, l = excessCount; i < l; i++) {
          if (EzAlertConfig.insertFirst) {
            that.hide(that, alerts[alerts.length - (i + 1)], 0, true);
          }
          else {
            that.hide(that, alerts[i], 0, true);
          }
        }
      }
    },
    hide: function(that, alertItem, delay, immediateRemoval) {
      var removalDelay = !!immediateRemoval ? 1000 : (delay + 1000);

      alertItem.hidePromise = $interval(function() {
        that.hideInterval(alertItem);
      }, delay, 1);

      alertItem.removePromise = $interval(function() {
        that.removeInterval(alertItem);
      }, removalDelay, 1);
    },
    showInterval: function(alertItem) {
      alertItem.hide = false;
      alertItem.show = true;
    },
    hideInterval: function(alertItem) {
      alertItem.show = false;
      alertItem.hide = true;
    },
    removeInterval: function(alertItem) {
      alerts.splice(alerts.indexOf(alertItem), 1);
    },
    hideAndShow: function(alertItem) {
      var that = this;

      if (!!alertItem.hidePromise || !!alertItem.removePromise) {
        if (!!alertItem.hidePromise) {
          $interval.cancel(alertItem.hidePromise);
        }
        if (!!alertItem.removePromise) {
          $interval.cancel(alertItem.removePromise);
        }
      }

      that.hideInterval(alertItem);

      /* NOTE about rapid successions of duplicate alerts:
       * If the time between alerts being added is less than 1 second,
       * the show/hide behaviour will not be consistent
       * (ie. re-shows fewer and last show gets hidden immediately).
       */

      $interval(function() {
        that.showInterval(alertItem);

        that.hide(that, alertItem, EzAlertConfig.delay);
      }, 500, 1);
    }
  };
}]);
