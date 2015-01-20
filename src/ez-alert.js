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
        EzAlert.hide(scope.alerts[index], 0);
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

      var duplicateFound = this.findDuplicates(alertItem, noClear);

      if (!!duplicateFound) {
        return;
      }

      $interval(function() {
        alertItem.show = true;
      }, 1, 1);

      this.hideExcessAlerts(this, true);

      if (EzAlertConfig.insertFirst) {
        alerts.unshift(alertItem);
      } else {
        alerts.push(alertItem);
      }

      if (!noClear) {
        this.hide(alertItem, EzAlertConfig.delay);
      }
    },
    findDuplicates: function(newAlert, noClear) {
      var that = this;

      for (var i = 0, l = alerts.length; i < l; i++) {
        var alertItem = alerts[i];

        if (alertItem.alertClass === newAlert.alertClass && alertItem.msg === newAlert.msg) {
          if (!noClear) {
            alertItem.resetDelay = true;
          }

          that.hideAndShow(alertItem);

          return true;
        }
      }

      return false;
    },
    hideExcessAlerts: function(that, repeat) {
      if (alerts.length >= EzAlertConfig.maxAlerts) {
        var excessCount = alerts.length - EzAlertConfig.maxAlerts + 1;

        for (var i = 0, l = excessCount; i < l; i++) {
          if (EzAlertConfig.insertFirst) {
            that.hide(alerts[alerts.length - (i + 1)], 0, true);
          }
          else {
            that.hide(alerts[i], 0, true);
          }
        }
      }

      if (!repeat) {
        $interval(function() {
          that.hideExcessAlerts(that, false);
        }, 100, 1);
      }
    },
    hide: function(alertItem, delay, immediateRemoval) {
      var that = this;

      var removalDelay = !!immediateRemoval ? 1000 : (delay + 1000);

      $interval(function() {
        /*if (!!alertItem.resetDelay) {
          delete alertItem.resetDelay;
          that.hide(alertItem, delay, immediateRemoval);
          
          return;
        }*/

        alertItem.show = false;
        alertItem.hide = true;
      }, delay, 1);

      $interval(function() {
        if (EzAlertConfig.insertFirst) {
          alerts.pop();
        } else {
          alerts.shift();
        }
      }, removalDelay, 1);
    },
    hideAndShow: function(alertItem) {
      var that = this;

      alertItem.show = false;
      alertItem.hide = true;

      /* Note about fast repetitions of duplicate items:
       * If duplicates appear in less than 500 ms,
       * One duplicate will remain on screen.
       */

      $interval(function() {
        alertItem.hide = false;
        alertItem.show = true;
      }, 500, 1);

      $interval(function() {
        if (!!alertItem.resetDelay) {
          delete alertItem.resetDelay;
          that.hide(alertItem, EzAlertConfig.delay);
          
          return;
        }
      }, 5, 100);
    }
  };
}]);
