//import mongoose from 'mongoose';
const mongoose = require("mongoose");

const config = require("../config/auth.config");

const Validate = require('../common/validation');
const MSG = require('../common/message');

const Admin = require("../models/admin.model");
const Portal = require("../models/portal.model");
const Authority = require("../models/authority.model");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  var emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (!emailReg.test(req.body.email)) {
    res.status(400).send({ message: "Enter valid email!" });
    return;
  }

  const admin = new Admin({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role
  });

  admin.save((err, admin) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Portal.find({ name: { $in: req.body.portal } }, (err, portals) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      admin.portals = portals.map(portal => portal._id);
      admin.save(err => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        res.send({ message: "Admin added successfully!" });
      });
    }
    );
  });
};

exports.signin = (req, res) => {
  console.log('SignIn calling');
  const email = Validate.email(req.body.email);
  if (email) return res.status(400).send({ status: 400, param: 'email', message: email });

  const password = Validate.password(req.body.password);
  if (password) return res.status(400).send({ status: 400, param: 'password', message: password });

  // const portal = Validate.portal(req.body.portal);
  // if (portal) return res.status(400).send({ status: 400, param: 'portal', message: portal });

  Admin.findOne({ email: req.body.email, isDeleted: false })
    .populate("portals")
    .exec(async (err, admin) => {
      console.log('admin---', admin);
      if (err) return res.status(500).send({ status: 500, message: MSG.somethingWrong });
      if (!admin) return res.status(200).send({ status: 400, message: MSG.noUser });
      var passwordIsValid = bcrypt.compareSync(req.body.password, admin.password);
      if (!passwordIsValid) return res.status(200).send({ status: 400, message: MSG.invalidEmailPassword });
      if (!admin.isActive) return res.status(200).send({ status: 400, message: MSG.accountInactive });

      // CHECK ADMIN HAS PERMISSION TO ACCESS THE PORTAL OR NOT
      var isAuthorize = false;
      if (admin.portals && admin.portals.length) {
        for (let i = 0; i < admin.portals.length; i++) {
          if (admin.portals[i].slug === req.body.portal) {
            isAuthorize = true;
          }
        }
      }
      if (!isAuthorize) return res.status(200).send({ status: 400, message: MSG.noAccess });

      var token = jwt.sign({ id: admin.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      // IF ADMIN HAS PORTAL ACCESS PERMISSION THEN GET HOW MANY ACCESS THEY HAVE
      // const authorities = await getAuthority(admin._id, req.body.portal);
      const authorities = [];
      
      const data = {
        id:           admin._id,
        name:         admin.name,
        email:        admin.email,
        image:        admin.image,
        permissions:  authorities
      }

      res.status(200).send({ auth: true, status: 200, message: 'Successfully logged.', token: token, data: data });
    });
};

const getAuthority = (adminId, portalId) => {
  return new Promise(resolve => {
    Authority.findOne({ adminId: adminId, portalId: portalId }).exec((err, res) => {
      if (err || !res || res.authority.length < 0) {
        resolve([]);
      } else {
        resolve(res.authority);
      }
    });
  });
};
