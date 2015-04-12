console.log("sqlite_template.test :" + module.paths);
var sqliteTemplate = require('sqlite_template');

var findChar = sqliteTemplate.langTemplate('Chinese_charater.db');
findChar.linkDb();
var con = {
	"table": "chaizi",
	"fields": ["id", "chaifen"],
	"conditions": {
		"id": [1, 2 ,5], 
		"OR":{
			"id":"5",
			"chaifen":"阝可",
		}
	}
}
findChar.findOne(con, function(err, row){
	console.log("one");
	console.log(row);
});
findChar.findAll(con, function(err, row){
	console.log("all");
	console.log(row);
});
findChar.closeDb();