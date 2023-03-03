const controller = require("../controllers/exclude_stockiest.controller");

module.exports = function(app) {
  // app.use(function(req, res, next) {
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "x-access-token, Origin, Content-Type, Accept"
  //   );
  //   next();
  // });

  const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', true);

    if ('OPTIONS' == req.method) {
      res.send(200);
    } else {
      next();
    }
  };
  app.use(allowCrossDomain);

  app.post("/api/excludeStockiestImport", controller.importExcludeStockiest);
};