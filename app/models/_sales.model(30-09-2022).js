const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesSchema = new mongoose.Schema({
    plantCode: {
        type: String,
        default: null
    },
    billDocNumber: {
        type: String,
        default: null
    },
    billDocDate: {
        type: Date,
        default: null
    },
    billDocType: {
        type: String,
        default: null
    },
    customer: {
        type: String,
        default: null
    },
    organization: {
        type: String,
        default: null
    },
    divSAPcode: {
        type: String,
        default: null
    },
    division: {
        type: String,
        default: null
    },
    materialCode: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    batch: {
        type: String,
        default: null
    },
    expireOn: {
        type: Date,
        default: null
    },
    salesQty: {
        type: Number,
        default: 0
    },
    nrv: {
        type: Number,
        default: 0
    },
    month: {
        type: String,
        default: null
    },
    year: {
        type: String,
        default: null
    },
    monthYear: {
        type: Date,
        default: null
    },
    billItemCategory: {
        type: String,
        default: null
    },
    salesOrg: {
        type: String,
        default: null
    },
    distChannel: {
        type: String,
        default: null
    },
    salesRegion: {
        type: String,
        default: null
    },
    salesLocation: {
        type: String,
        default: null
    },
    payTermDesc: {
        type: String,
        default: null
    },
    tinNumber: {
        type: String,
        default: null
    },
    billPartyCity: {
        type: String,
        default: null
    },
    salesUom: {
        type: String,
        default: null
    },
    mrp: {
        type: Number,
        default: 0
    },
    ptdBillValue: {
        type: Number,
        default: 0
    },
    totalValue: {
		type: Number,
        default: 0
	},
    roundOf: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: "629f2b920be81137cfedb9b6"
    }
}, {
    timestamps: true
});

mongoose.model('sales', SalesSchema);
module.exports = mongoose.model('sales');
