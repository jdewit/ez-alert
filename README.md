ez-alert
==============

Angular module for managing alerts easily. Styled for Twitter Bootstrap by default. 
No bootstrap js required.

Usage 
-----

Add ez.alert to your apps list of modules.
In your controller, you can inject the "EzAlert" service to add alerts.

```js 
angular.module('myApp', ['ez.alert'])

.controller('MyCtrl', function(EzAlert) {
  EzAlert.success('My alert in a success message');

  EzAlert.error('My alert in an error message');

  EzAlert.warning('My alert in a warning message that does not dissappear', true);
});

```

Add ez-alert markup to your html and include the dist files

```html 

  <head>
    <link href="dist/ez-alert.min.css" rel="stylesheet">
  </head>
  <body ng-app="myApp">

    <ez-alert></ez-alert>

    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.9/angular.js"></script>
    <script src="bower_componentns/ez-alert/dist/ez-alert.min.js"></script>
    <script src="bower_componentns/ez-alert/dist/ez-alert-tpl.js"></script>
  </body>
```

Demo
----

See <a href="http://embed.plnkr.co/Ed3VOV/preview" target="_blank">live demo</a> of the example in index.html.

***
Generated with <a href="http://github.com/jdewit/generator-ez-module" target="_blank">ez-module</a>
