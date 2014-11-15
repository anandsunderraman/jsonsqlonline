var jsonSqlControllers = angular.module('jsonSqlControllers', []);

//We have used an inline injection annotation to explicitly specify the dependency of the Controller on the $scope 
//service provided by Angular
jsonSqlControllers.controller('CreateDBCtrl', ['$scope', function($scope) {
  
  //parses the json object and saves it
  $scope.createDB = function() {
  	try {
  		var userJSONData = JSON.parse($scope.jsonData);
  		$scope.jsonDB = new jsonsql(userJSONData);
  	} catch (e) {
  		console.log(e);
  	}
  };

  //to check if input data is empty
  $scope.emptyInput = function() {
  	return angular.isUndefined($scope.jsonData)
  };

}]);

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