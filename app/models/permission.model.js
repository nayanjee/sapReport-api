const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PermissionSchema = new mongoose.Schema({
	portalId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Portal",
		default: null
	},
	permissionType: {
		type: String,
	},
	permissionId: {
		type: Number,
	},
	isActive: {
		type: Boolean,
		default: true
	},
	isDeleted: {
		type: Boolean,
		default: false
	}
});

mongoose.model('Permission', PermissionSchema);
module.exports = mongoose.model('Permission');
