var app = angular.module('tutor', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'stories.html',
        controller: 'StoriesCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
