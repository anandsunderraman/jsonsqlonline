module.exports = {
	name: 'CreateDBCtrl',
	definition: ['$scope', '$location', 'appContext', function($scope, $location, appContext) {
		  //parses the json object and saves it
		  $scope.createDB = function() {
		  	try {
		  		var userJSONData = JSON.parse($scope.jsonData);
		  		appContext.setJsonDB(userJSONData);
		  		$location.path('/queryDB');
		  	} catch (e) {
		  		console.log(e);
		  	}
		  };

		  $scope.loadSample = function() {
		  	$scope.jsonData = JSON.stringify(window.exampleJSON, null, "\t");	
		  };

		  //to check if input data is empty
		  $scope.emptyInput = function() {
		  	return angular.isUndefined($scope.jsonData);
		  };
    }]
};