'use strict';

angular.module('FileBrowserApp.config', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/home', {
        templateUrl: 'views/home.html'
    });

    $routeProvider.when('/filebrowser', {
        templateUrl: 'views/filebrowser.html'
    });

    $routeProvider.otherwise({ redirectTo: '/home' });

}])
;