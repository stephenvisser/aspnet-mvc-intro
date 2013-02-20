'use strict';

var myApp = angular.module('myApp', []);

myApp.config(['$routeProvider', function ($routeProvider) {
    //Set up routes
    $routeProvider
        .when('/', {
            templateUrl: '/Scripts/app/views/home.html',
            controller: 'HomeCtrl'
        })
        .otherwise({
           redirectTo: '/' 
        });
   } ]);

myApp.run(['$rootScope', function($rootScope) {

}]);