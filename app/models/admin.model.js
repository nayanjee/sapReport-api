const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
	},
	password: {
		type: String,
	},
	image: {
		type: String,
		default: "flower.png"
	},
	portals: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Portal"
		}
	],
	isActive: {
		type: Boolean,
		default: true
	},
	isDeleted: {
		type: Boolean,
		default: false
	}
});

mongoose.model('Admin', AdminSchema);
module.exports = mongoose.model('Admin');
