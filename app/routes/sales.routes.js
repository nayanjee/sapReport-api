const controller = require("../controllers/sales.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/sales", controller.getSales);
  app.post("/api/giftSales", controller.getGiftSales);
  app.post("/api/salesHoImport", controller.importHoSales);       // Upload SAP excel sheet
  app.post("/api/salesDistImport", controller.importDistSales);       // Upload SAP excel sheet
  app.post("/api/salesPhpImport", controller.importPHPSales); // Upload PHP excel sheet

  app.post("/api/ppwt", controller.getProductPriceWithTaxByMaterials);
  app.post("/api/ppwot", controller.getProductPriceWithoutTaxByMaterials);

  app.post("/api/multipliers", controller.getProductsMultiplier);
  app.post("/api/shelflifes", controller.getProductShelflife);
};