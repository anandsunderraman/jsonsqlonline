//a directive to show tabs
module.exports = {
	name: 'gotoTab',
	definition: function() {
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
    }
};