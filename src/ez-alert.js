'use_strict';

angular.module('ez.alert', ['ui.bootstrap'])

.controller('AlertCtrl', ['$scope', 'Alert', function($scope, Alert) {
  $scope.$watch(Alert.get, function() {
    $scope.alerts = Alert.get();
  });
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
}])

.service('Alert', ['$interval', function($interval) {
  var alerts = [],
      s,
      t;

  return {
    clear: function() {
      alerts = [];
    },
    get: function() {
      return alerts;
    },
    error: function(msg, noClear) {
      this.add('danger', msg, noClear);
    },
    warning: function(msg, noClear) {
      this.add('warning', msg, noClear);
    },
    success: function(msg, noClear) {
      this.add('success', msg, noClear);
    },
    add: function(type, msg, noClear) {
      if (!noClear) {
        this.clear();
      }

      if (s) {
        $interval.cancel(s);
        $interval.cancel(t);
      }

      alerts.push({type: type, msg: msg});

      s = $interval(function() {
        $('.alert').slideUp('slow');
      }, 8000, 1);

      var that = this;
      t = $interval(function() {
        that.clear();
      }, 10000, 1);
    }
  };
}]);
