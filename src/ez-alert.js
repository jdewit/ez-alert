'use_strict';

angular.module('ez.alert', ['ui.bootstrap'])

.controller('AlertCtrl', ['$scope', 'Alert', function($scope, Alert) {
  $scope.$watch(Alert.get, function() {
    $scope.alerts = Alert.get();
  });
  $scope.$watch(Alert.getModalAlerts, function() {
    $scope.modalAlerts = Alert.getModalAlerts();
  });
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
}])

.controller('NotifyCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
  $scope.cancel = function() {
    $modalInstance.dismiss();
  };
}])

.service('Alert', ['$timeout', '$modal', function($timeout, $modal) {
  var alerts = [],
      modalAlerts = [],
      s,
      t;

  return {
    clear: function() {
      alerts = [];
      modalAlerts = [];
    },
    get: function() {
      return alerts;
    },
    getModalAlerts: function() {
      return modalAlerts;
    },
    notify: function(header, text) {
      $modal.open({
        template: 'ez-alert-notify-tpl.html',
        controller: 'NotifyCtrl',
        resolve: {
          header: function() {
            return header;
          },
          text: function() {
            return text;
          }
        }
      }).result.then(function(callback) {
        if (callback) {
          callback();
        }
      });
    },
    error: function(msg, inModal, noClear) {
      this.add('error', msg, inModal, noClear);
    },
    warning: function(msg, inModal, noClear) {
      this.add('warning', msg, inModal, noClear);
    },
    success: function(msg, inModal, noClear) {
      this.add('success', msg, inModal, noClear);
    },
    add: function(type, msg, inModal, noClear) {
      if (!noClear) {
        this.clear();
      }

      if (s) {
        $timeout.cancel(s);
        $timeout.cancel(t);
      }

      if (inModal) {
        $('.modal.in .alert').remove();
        $('.modal.in .modal-body').prepend('<div class="alert alert-' + type + '">' + msg + '</div>');
      } else {
        alerts.push({type: type, msg: msg});
      }
      s = $timeout(function() {
        $('.alert').slideUp('slow');
      }, 8000);

      var that = this;
      t = $timeout(function() {
        that.clear();
      }, 10000);
    }
  };
}]);
