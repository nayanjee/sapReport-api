const db = require("../models");
const Admin = db.admin;

checkDuplicateEmail = (req, res, next) => {
  // Email
  Admin.findOne({
    email: req.body.email
  }).exec((err, admin) => {
    console.log(admin);
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (admin) {
      res.status(400).send({ message: "Failed! Email is already in use!" });
      return;
    }

    next();
  });
};

checkEmpty = (req, res, next) => {
  if ((req.body.name).trim().length == 0) {
    res.status(400).send({ message: "Name is required!" });
    return;
  }

  if ((req.body.email).trim().length == 0) {
    res.status(400).send({ message: "Email is required!" });
    return;
  }

  if ((req.body.password).trim().length == 0) {
    res.status(400).send({ message: "Password is required!" });
    return;
  }

  if (typeof req.body.portal !== 'object' || req.body.portal.length <= 0) {
    res.status(400).send({ message: "Portal is required and it must be an object!" });
    return;
  }

  next();
};

const verifySignUp = {
  checkEmpty,
  checkDuplicateEmail
};

module.exports = verifySignUp;
