/**
 * JSON Utilities and helpers
 */
var jsonUtils = function() {

	/**
     * Check if a particular json path is valid and returns value if valid else return nothing
     * @param {Object} obj
     * @param {String} path
     * @return {Array|Object|null}
     */
    this.getJsonNode = function(obj, path, condition) {
    	//evaluate condition on object
    	if (!_.isUndefined(condition) && !condition(obj)) {
    		return;
    	}
        var args = path.split('.');
        for (var i = 0; i < args.length; i++) {
            if (_.isNull(obj) || _.isUndefined(obj) || !obj.hasOwnProperty(args[i])) {
                return;
            }
            obj = obj[args[i]];
        }
        return obj;
    };

    /**
     * tells if a string is a json path
     * @param  {String}  jsonPath
     * @return {Boolean}
     */
    this.isJsonPath = function(jsonPath) {
    	return jsonPath.indexOf(".") !== -1;
    };

    /**
    * Create a json tree as per https://github.com/jonmiles/bootstrap-treeview
    * @param  {Object}
    * @return {Array} 
    */
    this.getJsonTree = function(jsonObj, parentPath) {
		var jsonTree = [];

		_.each(jsonObj, function(value, key) {

			var jsonPathBase = parentPath ? parentPath + '.' + key : key;

			var treeNode = {
				'text': key,
				'jsonPath': jsonPathBase,
				'nodes' : []
			};
			//handling the scenario where value is an array
			if(_.isArray(value)) {

				treeNode.text = treeNode.text + " {Array}";
				//iterating through an array
				_.each(value, function(arrayValues, arrayIndex) {
					var jsonPath = jsonPathBase + '.' + arrayIndex;
					//scenario where value in array is just primitive data
					if(!_.isObject(arrayValues)) {
						treeNode.nodes.push({
							'text': arrayIndex, 
							'jsonPath': jsonPath,
							'nodes': new Array({
								'text': arrayValues,
								'selectable': false
							})
						});	
					} else {
						//scenario where value in array is object or array, invoke recursion
						treeNode.nodes.push({
							'text': arrayIndex,
							'jsonPath': jsonPath, 
							'nodes': this.getJsonTree(arrayValues, jsonPath)
						});	
					}
					
				});

			} else if (_.keys(value).length > 0) {
				//handling the scenario where value is an object
				treeNode.text = treeNode.text + " {Object}";
				treeNode.nodes = this.getJsonTree(value, jsonPathBase);
			} else {
				treeNode.nodes.push({
					'text': value,
					'selectable': false
				});
			}
			jsonTree.push(treeNode);	
		});
        return jsonTree;
    };

    return this;
}();

module.exports = jsonUtils;