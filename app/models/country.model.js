const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CountrySchema = new mongoose.Schema({
	name: {
		type: String,
	},
	code: {
		type: String,
	},
	isoCode: {
		type: String,
	},
	isActive: {
		type: Boolean,
		default: true
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
	createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: "629f2b920be81137cfedb9b6"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: "629f2b920be81137cfedb9b6"
    }
}, {
    timestamps: true
});

mongoose.model('Country', CountrySchema);
module.exports = mongoose.model('Country');
