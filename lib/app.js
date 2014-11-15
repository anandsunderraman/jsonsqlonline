var jsonSqlApp = angular.module('jsonSql', ['ngRoute','jsonSqlControllers']);

jsonSqlApp.config(['$routeProvider', function($routeProvider) {
    
    $routeProvider.when('/createDB', {
        templateUrl: 'partials/createDB.html',
        controller: 'CreateDBCtrl'
    }).when('/queryDB', {
        templateUrl: 'partials/queryDB.html',
        controller: 'QueryDBCtrl'
    }).otherwise({
        redirectTo: '/createDB'
    });
    
}]);

