var jsonSqlControllers = angular.module('jsonSqlControllers', []);

//We have used an inline injection annotation to explicitly specify the dependency of the Controller on the $scope 
//service provided by Angular
jsonSqlControllers.controller('CreateDBCtrl', ['$scope', '$location', 'appContext', function($scope, $location, appContext) {

  var exampleJSON = { "country": [
  									{ "name" : "India", 
  									  "capital" : "New Delhi" 
  									},
  									{ "name" : "USA", 
  									  "capital" : "Washington DC"
  									}
  								]
  					};
  
  //pretty printing JSON
  $scope.jsonData = JSON.stringify(exampleJSON, null, "\t");

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
  	return angular.isUndefined($scope.jsonData);
  };

}]);

//controller to handle query functionality
jsonSqlControllers.controller('QueryDBCtrl', ['$scope', '$location', 'appContext', function($scope, $location, appContext) {

	$scope.isValidTable = true;
	$scope.isValidColumn = true;
	$scope.columns = '*';

	var jsonDB = appContext.getJsonDB();
	
	//if jsonDB is not defined or null redirect user to createDB screen
	if (angular.isUndefined(jsonDB) || jsonDB === null) {
		$location.path('/createDB');
	}

	$scope.jsonDB = jsonDB;

	//event handler for query
	$scope.queryDB = function() {
		initScreen();
		var table = jsonUtils.getJsonNode(jsonDB.db,$scope.table);
		if(_.isUndefined(table) || !jsonDB.isTableQueryable(table)) {
			$scope.isValidTable = false;
			return;
		}
		var columnNames = jsonDB.getColumnNames($scope.columns, table);
		//check if columns are valid
		if (columnNames.length === 0) {
			$scope.isValidColumn = false;
			return;
		}
		//then query the table
		$scope.queryResult = jsonDB.query($scope.columns, $scope.table);
		$scope.columnNames = Object.keys($scope.queryResult[0]);
	};

	$scope.checkValidTable = function() {
		return $scope.isValidTable;
	};

	$scope.checkValidColumns = function() {
		return $scope.isValidColumn;
	};

	function initScreen() {
		$scope.isValidTable = true;
		$scope.isValidColumn = true;
		$scope.queryResult = [];
		$scope.columnNames = [];
	}

}]);

//service to share data between the controllers
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