/**
	* @description      : 
	* @author           : nayan.prakash
	* @group            : 
	* @created          : 07/06/2022 - 14:52:07
	* 
	* MODIFICATION LOG
	* - Version         : 1.0.0
	* - Date            : 07/06/2022
	* - Author          : nayan.prakash
	* - Modification    : 
**/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PortalSchema = new mongoose.Schema({
	slug: {
		type: String,
	},
	name: {
		type: String,
	}
});

mongoose.model('Portal', PortalSchema);
module.exports = mongoose.model('Portal');
