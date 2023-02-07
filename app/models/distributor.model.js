const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DistributorSchema = new mongoose.Schema({
	customerId: {
		type: String,
	},
	plant: {
		type: String,
	},
	organization: {
		type: String,
	},
	countryId: {
		type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        default: null
	},
	stateId: {
		type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        default: null
	},
	cityId: {
		type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        default: null
	},
	margin: {
		type: Number,
		default: null
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

mongoose.model('Distributor', DistributorSchema);
module.exports = mongoose.model('Distributor');
