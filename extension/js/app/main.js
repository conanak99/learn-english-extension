let module = angular.module("app", ['ngRoute']);

module.config([
  '$routeProvider',
  '$locationProvider',
  '$compileProvider',
  function($routeProvider, $locationProvider, $compileProvider) {
    // Remove :unsafe from chrome extension
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension):/);

    $routeProvider.when('/', {
      templateUrl: 'js/app/template/quiz.html',
      controller: 'IndexController'
    }).when('/result/:result/:word', {
      templateUrl: 'js/app/template/result.html',
      controller: 'ResultController'
    });
  }
]);
