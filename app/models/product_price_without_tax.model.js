const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductPriceWithoutTaxSchema = new mongoose.Schema({
    material: {
        type: Number,
        default: null
    },
    materialDesc: {
        type: String,
        default: null
    },
    division: {
        type: Number,
        default: 0
    },
    packageSize: {
        type: Number,
        default: 0
    },
    9001: {
        type: String,
        default: 0
    },
    9002: {
        type: String,
        default: 0
    },
    9003: {
        type: String,
        default: 0
    },
    9004: {
        type: String,
        default: 0
    },
    9005: {
        type: String,
        default: 0
    },
    9006: {
        type: String,
        default: 0
    },
    9007: {
        type: String,
        default: 0
    },
    9008: {
        type: String,
        default: 0
    },
    9009: {
        type: String,
        default: 0
    },
    9010: {
        type: String,
        default: 0
    },
    9011: {
        type: String,
        default: 0
    },
    9012: {
        type: String,
        default: 0
    },
    9013: {
        type: String,
        default: 0
    },
    9014: {
        type: String,
        default: 0
    },
    9015: {
        type: String,
        default: 0
    },
    9016: {
        type: String,
        default: 0
    },
    9017: {
        type: String,
        default: 0
    },
    9018: {
        type: String,
        default: 0
    },
    9019: {
        type: String,
        default: 0
    },
    9020: {
        type: String,
        default: 0
    },
    9021: {
        type: String,
        default: 0
    },
    9022: {
        type: String,
        default: 0
    },
    9023: {
        type: String,
        default: 0
    },
    9024: {
        type: String,
        default: 0
    },
    9025: {
        type: String,
        default: 0
    },
    9026: {
        type: String,
        default: 0
    },
    9027: {
        type: String,
        default: 0
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

mongoose.model('product_price_without_tax', ProductPriceWithoutTaxSchema);
module.exports = mongoose.model('product_price_without_tax');
