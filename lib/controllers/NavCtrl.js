module.exports = {
	name: 'NavCtrl',
	definition: ['$scope', '$location', 'appContext', function($scope, $location, appContext) {
		$scope.loadDocs = function() {
	  		$location.path('/docs');
	    };

	    $scope.loadIndex = function() {
	  		$location.url('/createDB');
	    };
    }]
};