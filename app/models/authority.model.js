const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthoritySchema = new mongoose.Schema({
  adminId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Admin",
		default: null
	},
	portalId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Portal",
		default: null
	},
	authority: [
		{
			type: Number,
			default: []
		}
	]
});

mongoose.model('Authority', AuthoritySchema);
module.exports = mongoose.model('Authority');
