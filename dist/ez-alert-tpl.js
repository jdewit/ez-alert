angular.module('ez.alert').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ez-alert-tpl.html',
    "<div class=\"ez-alert-container\">\n" +
    "  <div class=\"ez-alert-item\" ng-repeat=\"alert in alerts\" ng-class=\"{'ez-hide': alert.hide}\">\n" +
    "    <div class=\"{{ alert.alertClass }}\" ng-click=\"hideAlert($index)\">\n" +
    "      <a class=\"close\" aria-hidden=\"true\">&times;</a>\n" +
    "      <div ng-bind=\"alert.msg\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );

}]);
