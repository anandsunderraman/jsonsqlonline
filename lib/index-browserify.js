require('angular');
require('angular-route');

var GotoTab = require('./directives/GotoTab'),
    JsonValidate = require('./directives/JsonValidate'),
    ShowTab = require('./directives/ShowTab');

var AppContext = require('./factory/AppContext');

var CreateDBCtrl = require('./controllers/CreateDBCtrl'),
    DocsCtrl = require('./controllers/DocsCtrl'),
    NavCtrl = require('./controllers/NavCtrl'),
    QueryDBCtrl = require('./controllers/QueryDBCtrl');

angular.module('jsonSql', ['ngRoute'])
	   .config(['$routeProvider', function($routeProvider) {
		    
		    $routeProvider.when('/createDB', {
		        templateUrl: 'partials/createDB.html',
		        controller: 'CreateDBCtrl'
		    }).when('/queryDB', {
		        templateUrl: 'partials/queryDB.html',
		        controller: 'QueryDBCtrl'
		    }).when('/docs', {
		        templateUrl: 'partials/docs.html',
		        controller: 'DocsCtrl'
		    }).otherwise({
		        redirectTo: '/createDB'
		    });
		    
	   }])
	   .controller(CreateDBCtrl.name, CreateDBCtrl.definition)
	   .controller(DocsCtrl.name, DocsCtrl.definition)
	   .controller(NavCtrl.name, NavCtrl.definition)
	   .controller(QueryDBCtrl.name, QueryDBCtrl.definition)
	   .directive(GotoTab.name, GotoTab.definition)
	   .directive(JsonValidate.name, JsonValidate.definition)
	   .directive(ShowTab.name, ShowTab.definition)
	   .factory(AppContext.name, AppContext.definition);

angular.bootstrap('html', ['jsonSql'], {
    strictDi: true
});
