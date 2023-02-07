const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductMultiplierSchema = new mongoose.Schema({
    division: {
        type: Number,
        default: 0
    },
    materialDesc: {
        type: String,
        default: null
    },
    material: {
        type: Number,
        default: null
    },
    multiplier: {
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

mongoose.model('product_multiplier', ProductMultiplierSchema);
module.exports = mongoose.model('product_multiplier');
