//app context factory
module.exports = {
	name: 'appContext',
	definition: function() {
		return {
			jsonDB: null,
			setJsonDB: function(jsonObj) {
				this.jsonDB = new jsonsql(jsonObj);
			},
			getJsonDB: function() {
				return this.jsonDB;
			}
		}
    }
};