var jsonSqlModule = angular.module('jsonSql', []);

jsonSqlModule.controller('MainCtrl', ['$scope', function($scope) {
  
  //parses the json object and saves it
  $scope.createDB = function() {
  	try {
  		var userJSONData = JSON.parse($scope.jsonData);
  		$scope.jsonDB = new jsonsql(userJSONData);
  	} catch (e) {
  		console.log(e);
  	}
  };

}]);
