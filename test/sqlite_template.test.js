console.log("sqlite_template.test :" + module.paths);
var sqliteTemplate = require('sqlite_template');

var findChar = sqliteTemplate.langTemplate('Chinese_charater.db');
findChar.linkDb();
var con = {
	"table": "chaizi",
	"fields": ["id", "chaifen"],
	"conditions": {
		"id>": 1, 
		"OR":{
			"id":"3",
			"chaifen":"阝可",
		}
	}
}
findChar.findOne(con);
findChar.closeDb();