//a directive to show tabs
module.exports = {
	name: 'showTab',
	definition: function() {
		return {
			link: function (scope, element, attrs) {
	            element.click(function(e) {
	                e.preventDefault();
	                $(element).tab('show');
	            });
	        }
		}
	}
};