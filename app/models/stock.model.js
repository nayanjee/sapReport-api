const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StockSchema = new mongoose.Schema({
    plant: {
        type: String,
        default: null
    },
    division: {
        type: Number,
        default: 0
    },
    divisionName: {
        type: String,
        default: null
    },
    material: {
        type: Number,
        default: null
    },
    materialDesc: {
        type: String,
        default: null
    },
    stockQty: {
        type: Number,
        default: 0
    },
    batchNo: {
        type: String,
        default: null
    },
    value: {
        type: Number,
        default: 0
    },
    transitStock: {
        type: Number,
        default: 0
    },
    transitValue: {
        type: Number,
        default: 0
    },
    expireOn: {
        type: Date,
        default: null
    },
    month: {
        type: Number,
        default: null
    },
    year: {
        type: Number,
        default: null
    },
    monthYear: {
        type: Date,
        default: null
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

mongoose.model('stocks', StockSchema);
module.exports = mongoose.model('stocks');
