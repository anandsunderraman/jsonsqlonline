module.exports = {
	name: 'DocsCtrl',
	definition: ['$scope', '$location', 'appContext', function($scope, $location, appContext) {
		$scope.sampleJSON = window.exampleJSON;
	}]
};