var jsonSqlControllers = angular.module('jsonSqlControllers', ['jsonFormatter']);

//controller for the navbar
jsonSqlControllers.controller('NavCtrl', ['$scope', '$location', 'appContext', function($scope, $location, appContext) {

    $scope.loadDocs = function() {
  		$location.path('/docs');
    };

    $scope.loadIndex = function() {
  		$location.url('/createDB');
    };
  
}]);
//We have used an inline injection annotation to explicitly specify the dependency of the Controller on the $scope 
//service provided by Angular
jsonSqlControllers.controller('CreateDBCtrl', ['$scope', '$location', 'appContext', function($scope, $location, appContext) {
  //parses the json object and saves it
  
  if(appContext.getJsonDB()) {
	$scope.jsonData = JSON.stringify(appContext.getJsonDB().db, null, 8);
  }
  $scope.createDB = function() {
  	try {
  		var userJSONData = JSON.parse($scope.jsonData);

  		//when entered data is an array it should be wrapped into an object to be able to query it easily
  		if (_.isArray(userJSONData)) {
  			userJSONData = {'dataArray': userJSONData};
  		}

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

}]);

//controller to handle query functionality
jsonSqlControllers.controller('QueryDBCtrl', ['$scope', '$location', 'appContext', '$filter', function($scope, $location, appContext, $filter) {
	var orderBy = $filter('orderBy');
	$scope.isValidTable = true;
	$scope.isValidColumn = true;
	$scope.isValidWhereClause = true;
	$scope.columns = '*';

	var jsonDB = appContext.getJsonDB();
	
	//if jsonDB is not defined or null redirect user to createDB screen
	if (angular.isUndefined(jsonDB) || jsonDB === null) {
		$location.path('/createDB');
	}

	$scope.jsonDB = jsonDB;

	//contruct the data tree based
	$('.jsonTree').treeview({
		data: jsonUtils.getJsonTree(jsonDB.db),
		collapseIcon: "glyphicon glyphicon-chevron-down",
		expandIcon:   "glyphicon glyphicon-chevron-right"
	});

	//on page load do a select * to demonstrate the ability of the app
	if ($scope.jsonDB.db.dataArray) {
		$scope.table = 'dataArray';
		//then query the table
		$scope.queryResult = jsonDB.query('*', $scope.table, undefined);
		if (_.isArray($scope.queryResult)) {
			$scope.columnNames = Object.keys($scope.queryResult[0]);	
		} else {
			$scope.columnNames = Object.keys($scope.queryResult);
		}
	} else {
		//search for one key in the db object that is an object
		var db = $scope.jsonDB.db;
		var keysForObjects = Object.keys(db).filter(function(key){
			return _.isObject(db[key]);
		});

		if (keysForObjects.length > 0) {
			$scope.table = keysForObjects[0];
			$scope.queryResult = jsonDB.query('*', $scope.table, undefined);
			if (_.isArray($scope.queryResult)) {
				$scope.columnNames = Object.keys($scope.queryResult[0]);	
			} else {
				$scope.columnNames = Object.keys($scope.queryResult);
			}
		}
	}

	//event handler for query
	$scope.queryDB = function() {
		resetScreen();


		if($scope.table === undefined || $scope.table === ""){
			$scope.isValidTable = false;
			return;
		}
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

		var whereClauseFn, whereClause = $scope.whereClause;

		if (!_.isUndefined(whereClause)) {
			whereClauseFn = jsonDB.getWhereClauseFn(whereClause);
			if (_.isNull(whereClauseFn)) {
				$scope.isValidWhereClause = false;
				return;
			}
		}
		
		//then query the table
		$scope.queryResult = jsonDB.query($scope.columns, $scope.table, whereClauseFn);
		if (_.isArray($scope.queryResult)) {
			$scope.columnNames = Object.keys($scope.queryResult[0]);	
		} else {
			$scope.columnNames = Object.keys($scope.queryResult);
		}

	    $scope.order("-" + $scope.columnNames[0],$scope.reverse);
	};

	$scope.order = function(predicate, reverse) {
      $scope.queryResult = orderBy($scope.queryResult, predicate, reverse);
    };

	$scope.checkValidTable = function() {
		return $scope.isValidTable;
	};

	$scope.checkValidColumns = function() {
		return $scope.isValidColumn;
	};

	$scope.checkValidWhereClause = function() {
		return $scope.isValidWhereClause;
	};

	$scope.populateFrom = function() {
		var selectedNodes = $('.jsonTree').treeview('getSelected');
		if (!_.isUndefined(selectedNodes)) {
			$scope.table = selectedNodes[0].jsonPath			
		}
	};

	$scope.populateSelect = function() {
		var selectedNodes = $('.jsonTree').treeview('getSelected');
		if (!_.isUndefined(selectedNodes)) {
			$scope.columns = $scope.columns + ',' + selectedNodes[0].jsonPath			
		}
	};

	function resetScreen() {
		$scope.isValidTable = true;
		$scope.isValidColumn = true;
		$scope.isValidWhereClause = true;
		$scope.queryResult = undefined;
		$scope.columnNames = [];
	};

  var downloadFile = function(fileName, data, type) {
		var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:' + type + ';charset=utf-8,' + encodeURI(data);
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName;
    hiddenElement.click();
  };

	$scope.csvFile = function(){
		var csv='';
		var header = [];
		$scope.columnNames.forEach(function(a){
			 header.push(a);			 			
		});
		csv = header.join(',')+'\n';
		
		var rows = [];

		$scope.queryResult.forEach(function(i){
			$scope.columnNames.forEach(function(j){
				if(_.isObject(i[j])){
					rows.push(JSON.stringify(i[j]));
				}else
				{
				rows.push(i[j]);
			}
			
			});
			csv = csv+rows.join(',')+'\n';
			rows = [];	
			
		});
		$scope.csv	= csv;
		downloadFile('csvFile.csv', csv, 'text/csv');
		return $scope.csv;
  };
  
  $scope.jsonFile = function(){
    downloadFile('jsonFile.json',
      JSON.stringify($scope.queryResult.map(m => _.omit(m, ['$$hashKey'])), null, '\t'),
      'application/json'
    );
		return $scope.queryResult;
	};

}]);

//controller for docs section
jsonSqlControllers.controller('DocsCtrl', ['$scope', '$location', 'appContext', function($scope, $location, appContext) {
	$scope.sampleJSON = window.exampleJSON;
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
jsonSqlControllers.directive('jsonvalidate', function() {
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

//creating a showTab directive for bootstrap tabs
jsonSqlControllers.directive('showTab', function() {
	return {
		link: function (scope, element, attrs) {
            element.click(function(e) {
                e.preventDefault();
                $(element).tab('show');
            });
        }
	}
});

//creating gototoab directive for internal tab links
jsonSqlControllers.directive('gotoTab', function() {
	return {
		link: function (scope, element, attrs) {
            element.click(function(e) {
                e.preventDefault();
                var tabDestination = attrs.gotoTab;

                if(!angular.isUndefined(tabDestination)) {
                	var tabElement = 'a[href="#' + tabDestination + '"]';
                	$(tabElement).tab('show');
                } else {
                	console.log('goto-tab attributes not set');
                }
                
            });
        }
	}
});