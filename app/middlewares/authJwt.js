/**
    * @description      : 
    * @author           : nayan.prakash
    * @group            : 
    * @created          : 04/06/2022 - 16:39:47
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 04/06/2022
    * - Author          : nayan.prakash
    * - Modification    : 
**/
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Admin = db.admin;
const Portal = db.portal;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.adminId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  Admin.findById(req.adminId).exec((err, admin) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Portal.find(
      {
        _id: { $in: admin.portals }
      },
      (err, portals) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < portals.length; i++) {
          if (portals[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Portal!" });
        return;
      }
    );
  });
};

isModerator = (req, res, next) => {
  Admin.findById(req.adminId).exec((err, admin) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Portion.find(
      {
        _id: { $in: admin.portions }
      },
      (err, portions) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < portions.length; i++) {
          if (portions[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;
