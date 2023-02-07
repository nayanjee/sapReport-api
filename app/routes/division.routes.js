const controller = require("../controllers/division.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/divisions", controller.getDivisions);
  app.get("/api/divisionDropdown", controller.getDivisionDropdown);

  app.put("/api/division/changeStatus", controller.changeStatus);
};