const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// This table is being used as an "Exclude Stockiest".
const StockiestSchema = new mongoose.Schema({
    plant: {
        type: String,
        default: null
    },
    customerId: {
        type: String,
        default: null
    },
    organization: {
        type: String,
        default: null
    },
    /* stateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        default: null
    },
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        default: null
    }, */
    stateId: {
        type: String,
        default: null
    },
    cityId: {
        type: String,
        default: null
    },
    status: {
        type: Number,
        default: 1
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

mongoose.model('stockiest', StockiestSchema);
module.exports = mongoose.model('stockiest');
