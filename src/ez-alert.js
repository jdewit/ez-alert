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

      $interval(function() {
        alertItem.show = true;
      }, 50, 1);

      if (alerts.length >= EzAlertConfig.maxAlerts) {
        if (EzAlertConfig.insertFirst) {
          this.hide(alerts[alerts.length - 1]);

          $interval(function() {
            alerts.pop();
          }, EzAlertConfig.delay, 1);
        } else {
          this.hide(alerts[0]);
          
          $interval(function() {
            alerts.shift();
          }, EzAlertConfig.delay, 1);
        }
      }

      if (EzAlertConfig.insertFirst) {
        alerts.unshift(alertItem);
      } else {
        alerts.push(alertItem);
      }

      if (!noClear) {
        this.hide(alertItem, EzAlertConfig.delay);
      }
    },
    hide: function(alertItem, delay) {
      $interval(function() {
        alertItem.show = false;
        alertItem.hide = true;
      }, delay, 1);
    }
  };
}]);
