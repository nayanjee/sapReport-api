const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesSchema = new mongoose.Schema({
    plant: {
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
    billToParty: {
        type: String,
        default: null
    },
    billToPartyName: {
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
    batchNo: {
        type: String,
        default: null
    },
    salesQty: {
        type: Number,
        default: 0
    },
    netValue: {
        type: Number,
        default: 0
    },
    itemCategory: {
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
    storageLocation: {
        type: String,
        default: null
    },
    paymentTermDesc: {
        type: String,
        default: null
    },
    gstNo: {
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
    mrpValue: {
        type: Number,
        default: 0
    },
    billValue: {
        type: Number,
        default: 0
    },
    totalValue: {
		type: Number,
        default: 0
	},
    roundOfValue: {
        type: Number,
        default: 0
    },
    discount: {
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
    }
}, {
    timestamps: true
});

mongoose.model('sales', SalesSchema);
module.exports = mongoose.model('sales');
