var jsonSqlControllers = angular.module('jsonSqlControllers', []);

//We have used an inline injection annotation to explicitly specify the dependency of the Controller on the $scope 
//service provided by Angular
jsonSqlControllers.controller('CreateDBCtrl', ['$scope', '$location', 'appContext', function($scope, $location, appContext) {
  
  //parses the json object and saves it
  $scope.createDB = function() {
  	try {
  		var userJSONData = JSON.parse($scope.jsonData);
  		// $scope.jsonDB = new jsonsql(userJSONData);
  		appContext.setJsonDB(userJSONData);
  		$location.path('/queryDB');
  	} catch (e) {
  		console.log(e);
  	}
  };

  //to check if input data is empty
  $scope.emptyInput = function() {
  	return angular.isUndefined($scope.jsonData)
  };

}]);

jsonSqlControllers.controller('QueryDBCtrl', ['$scope', '$location', 'appContext', function($scope, $location, appContext) {

	$scope.jsonDB = appContext.getJsonDB();

	$scope.queryDB = function() {
		console.log('Running query');
	};

}]);

jsonSqlControllers.factory('appContext', function() {
	return {
		jsonDB: null,
		setJsonDB: function(jsonObj) {
			this.jsonDB = new jsonsql(jsonObj);
		},
		getJsonDB: function() {
			return this.jsonDB;
		}
	};
});

//creating a json directive to check validity of JSON string
jsonSqlControllers.directive('json', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			ctrl.$validators.json = function(modelValue, viewValue) {
				if (ctrl.$isEmpty(modelValue)) {
		          // consider empty models to be valid
		          return true;
		        }

		        try {
		        	var jsonObject = JSON.parse(viewValue);
		        	return true;
		        } catch (e) {
		        	return false;
		        }
			}
		}
	}
});