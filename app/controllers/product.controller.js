const db = require("../models");
const Product = db.products;


exports.getProductByDivisionId = function(req, res) {
  Product.find({status: 1, divSAPcode: req.params.divisionId }, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
}

exports.getProductByDivisions = function(req, res) {
  console.log('getProductByDivisions--', req.body);
  Product.find({status: 1, divSAPcode: { $in: req.body.divisions } }, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
}