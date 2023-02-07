const controller = require("../controllers/stock.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // app.get("/api/sales", controller.getSales);
  // app.get("/api/product/:divisionId", controller.getProductByDivisionId);

  app.post("/api/stocks", controller.getStocks);
  app.post("/api/stocksHoImport", controller.importHoStocks); // Upload SAP excel sheet
  app.post("/api/stocksDistImport", controller.importDistStocks); // Upload SAP excel sheet
  app.post("/api/stocksPhpImport", controller.importPHPStocks); // Upload PHP excel sheet
};