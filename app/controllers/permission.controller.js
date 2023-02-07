const db = require("../models");
const Permission = db.permission;

exports.add = (req, res) => {
  const reqData = {
    portalId: req.body.portal,
    permissionType: req.body.type,
    permissionId: req.body.id
  };

  Permission.create(reqData, (err, suc) => {
    if (err) return res.status(500).send({status: 400, message: 'somethingWrong'});
    res.status(200).send({status:200, message:'added', data:suc});
  });
};
