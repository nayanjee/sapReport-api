const db = require("../models");
const Division = db.division;

exports.getDivisions = function(req, res) {
    Division.find({isDeleted: false}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  }).sort({name: 1});
}

exports.getDivisionDropdown = function(req, res) {
	Division.find({isActive: true, isDeleted: false, division: {$ne: '91'}}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  }).sort({name: 1});
}

exports.changeStatus = (req, res) => {
  const updateData = {status: req.body.status, updatedBy: req.body.updatedBy};
  Division.updateOne({ _id: req.body._id }, updateData, function (err, data) {
    if (err) {
      return res.status(400).send({ status: 400, message: "somethingWrong" });
    } else {
        res.status(200).send({ status: 200, message: "successfullyUpdated", data: [] });
    }
  });
};