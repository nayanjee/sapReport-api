const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DivisionSchema = new mongoose.Schema({
	division: {
		type: Number,
		default: 0
	},
	name: {
		type: String,
		default: null
	},
	status: {
		type: Number,
		default: 1
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

mongoose.model('Division', DivisionSchema);
module.exports = mongoose.model('Division');
