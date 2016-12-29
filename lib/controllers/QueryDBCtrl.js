var _ = require('underscore');

module.exports = {
	name: 'QueryDBCtrl',
	definition: ['$scope', '$location', 'appContext', function($scope, $location, appContext) {
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
		$('.jsonTree').treeview({
			data: jsonUtils.getJsonTree(jsonDB.db),
			collapseIcon: "glyphicon glyphicon-chevron-down",
			expandIcon:   "glyphicon glyphicon-chevron-right"
		});

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

		function initScreen() {
			$scope.isValidTable = true;
			$scope.isValidColumn = true;
			$scope.isValidWhereClause = true;
			$scope.queryResult = [];
			$scope.columnNames = [];
		}
    }]
};