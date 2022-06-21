function jsonsql(jsonObject) {
	this.db = jsonObject;
	this.jsonPathSeparator = '->';
	//the table being queried currently
	this.currentTable = null;
};

/**
 * Perform a sql like query on a JSON object
 * @param  {String | Array} columns columns to be queried on
 * user can pass '*' which means select all properties
 * user can pass a single string denoting the property in an object
 * user can pass a list of strings, denoting multiple properties in an object
 * column names can be json paths to accomodate scenarios where user wants to query nested objects
 * @param  {String} tablePath   json path that must be queried
 * @return {Array}
 */
jsonsql.prototype.query = function(columnNames, tablePath, whereClauseFn) {
	this.currentTable = null;
	var table = jsonUtils.getJsonNode(this.db, tablePath),
		columns, queryResult;
	
	//check if the table exists in the json object
	if (!this.isTableQueryable(table)) {
		console.log('tablepath cannot be queried');
		return;
	}
	//setting the current table
	this.currentTable = table;

	columns = this.getColumnNames(columnNames, table);

	//column names are not valid
	if (columns.length === 0) {
		return;
	}
	
	//always return the result as an array
	queryResult = [];
	var resultRow;
	if (_.isArray(table)) {
		_.each(table, function(tableRow) {
			resultRow = this.pickProperties(tableRow, columns, whereClauseFn);
			if (!_.isEmpty(resultRow)) {
				queryResult.push(resultRow);
			}
			//queryResult.push(this.pickProperties(tableRow, columns, whereClauseFn));
		}, this);
	} else {
		resultRow = this.pickProperties(table, columns, whereClauseFn);
		if (!_.isEmpty(resultRow)) {
			queryResult.push(resultRow);
		}
	}

	return queryResult;
};

/**
 * checks if a table can be queried
 * a table can be queried only if
 * a. it is not undefined
 * b. it is not a function
 * c. it is an array or an object
 * @param  table 
 * @return {Boolean}
 */
jsonsql.prototype.isTableQueryable = function(table) {
	return (!_.isUndefined(table) && !_.isFunction(table) && (_.isArray(table) || _.isObject(table)));
};

/**
 * gets the list of columns to query on
 * @param  {String | Array} columnNames
 * @param  {Object | Array} table
 * @return {Array} columnNames
 */
jsonsql.prototype.getColumnNames = function(columnsList, table) {
	var columns = [], tableObj; 
	if (_.isArray(table)) {
		tableObj = table[0];
	} else {
		tableObj = table;
	}

	if(_.isString(columnsList)) {
		if(columnsList === '*') {
			return _.keys(tableObj);
		} else if (columnsList.indexOf(",") !== -1) {
			//accomodate the case where user gives column names as strings delimited by commas
			//trim the column Names
			columns = _.chain(columnsList.split(",")).map(function(columnName) {
				return columnName.trim();
			}).value(); 
		} else {
			columns.push(columnsList.trim());
		}
	} else if(_.isArray(columnsList)) {
		columns = columnsList;
	}

	//check if columns are valid
	var isValidColumn = this.isValidColumn(columns, tableObj);

	if (isValidColumn) {
		return columns;
	} else {
		return [];
	}
};

/**
 * validate column names
 * a column name is valid if
 * a. if the column is a propertyName and the propertyName exists in the object
 * b. if the column is a jsonPath and the jsonPath is not undefined and does not point in turn to an array or an object
 * @param  {Array} columns 
 * @param  {Object} tableObj
 * @return {Boolean}
 */
jsonsql.prototype.isValidColumn = function(columns, tableObj) {
	var isValidColumn = true, columnName, valueObj;
	
	for (var i = 0; i < columns.length; i++) {
		columnName = columns[i];
		//check for undefined, null,empty
		if(_.isUndefined(columnName) || _.isNull(columnName) || _.isEmpty(columnName)) {
			isValidColumn = false;
			break;
		}
		//if a column name is a json path, make sure
		//a. the path is correct
		//b. the path does not lead to array or an object or a function
		if (jsonUtils.isJsonPath(columnName)) {
			valueObj = jsonUtils.getJsonNode(tableObj, columnName);
			if(_.isUndefined(valueObj) || _.isFunction(valueObj)) {
				isValidColumn = false;
				break;
			}
		} else if (!_.has(tableObj, columnName)){
			//if a column name is a string, see if the property exists on the object
			isValidColumn = false;
			break;
		}	
	}

	if(!isValidColumn) {
		//log error for columnName
		console.log('Column name: ' + columnName + ' is not valid');
	}
	return isValidColumn;
};

/**
 * Checks if a string is a valid javascript statement
 * @param  {String} jsString
 * @return {Boolean}
 */
jsonsql.prototype.isValidJS = function(jsString) {
	var isValidJS = true;
	try {
		esprima.parse(jsString);
	} catch(e) {
		isValidJS = false;
	}
	return isValidJS;
};

/**
 * Constructs a where clause function from jsString
 * @param  {String} jsString
 * @return {Function}
 */
jsonsql.prototype.getWhereClauseFn = function(jsString) {
	var whereClauseFn = null;
	if (this.isValidJS(jsString)) {
		whereClauseFn = new Function('return ' + jsString + ';');
	}
	return whereClauseFn;
};

/**
 * picks a list of properties from an object
 * @param  {Object} obj
 * @param  {Array} properties
 * @param  {Array} aliases aliases for columns optional
 * @return {Object}
 */
jsonsql.prototype.pickProperties = function(obj, properties, whereClauseFn, aliases) {
	var result = {}, tmpValue;

	//if obj  does not satisfy where clause return empty obj
	if(!_.isUndefined(whereClauseFn) && !whereClauseFn.apply(obj)) {
		return result;
	}
	//if aliases are not defined we need to defined them as name of properties
	//if the properties are json paths then create the aliases from the json paths
	if(_.isUndefined(aliases)) {
		aliases = [];
		_.each(properties, function(key) {
			if(jsonUtils.isJsonPath(key)) {
				aliases.push(key.split('.').join(this.jsonPathSeparator));
			} else {
				aliases.push(key);
			}
		}, this);
	}

	//extract the properties from the object and return a result object
	_.each(properties, function(key, index) {
		if(jsonUtils.isJsonPath(key)) {
			tmpValue = jsonUtils.getJsonNode(obj, key);
			if (!_.isUndefined(tmpValue)) {
				result[aliases[index]] = tmpValue;
			} else {
				result[aliases[index]] = '';
			}
		} else if(obj.hasOwnProperty(key)) {
			result[aliases[index]] = obj[key];
		}
	});
	return result;
};

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
				'nodes' : [],
				'state': {
					'expanded': false
				}
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
							}),
							'state': {
								'expanded': false
							}
						});	
					} else {
						//scenario where value in array is object or array, invoke recursion
						treeNode.nodes.push({
							'text': arrayIndex,
							'jsonPath': jsonPath, 
							'nodes': this.getJsonTree(arrayValues, jsonPath),
							'state': {
								'expanded': false
							}
						});	
					}
					
				});

			} else if (_.keys(value).length > 0) {
				//handling the scenario where value is an object
				treeNode.text = treeNode.text + " {Object}";
				treeNode.nodes = this.getJsonTree(value, jsonPathBase);
				treeNode.state = {
						'expanded': false
				};
			} else {
				treeNode.nodes.push({
					'text': value,
					'selectable': false,
					'state': {
						'expanded': false
					}
				});
			}
			jsonTree.push(treeNode);	
		});
        return jsonTree;
    };

    return this;
}();