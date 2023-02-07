/**
    * @description      : 
    * @author           : nayan.prakash
    * @group            : 
    * @created          : 06/06/2022 - 14:08:26
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 06/06/2022
    * - Author          : nayan.prakash
    * - Modification    : 
**/
const controller = require("../controllers/permission.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.post("/api/permission/create", controller.add);
};
