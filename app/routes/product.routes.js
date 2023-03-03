const controller = require("../controllers/product.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/product/:divisionId", controller.getProductByDivisionId);

  app.post("/api/product/byDivision", controller.getProductByDivisions);
  app.post("/api/productImport", controller.importProduct);
};
