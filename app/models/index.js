/**
    * @description      : 
    * @author           : nayan.prakash
    * @group            : 
    * @created          : 04/06/2022 - 15:17:43
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 04/06/2022
    * - Author          : nayan.prakash
    * - Modification    : 
**/
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose     = mongoose;
//db.city         = require("./city.model");
//db.state        = require("./state.model");
db.admin        = require("./admin.model");
db.portal       = require("./portal.model");
db.country      = require("./country.model");
db.authority    = require("./authority.model");
db.permission   = require("./permission.model");

db.batch = require("./batch.model");
db.sales = require("./sales.model");
db.stocks = require("./stock.model");
db.products = require("./product.model");
db.division = require("./division.model");
db.stockiest = require("./stockiest.model");
db.distributor = require("./distributor.model");
db.product_shelflife = require("./product_shelflife.model");
db.product_multiplier = require("./product_multiplier.model");
db.product_price_with_tax = require("./product_price_with_tax.model");
db.product_price_without_tax = require("./product_price_without_tax.model");

module.exports = db;
