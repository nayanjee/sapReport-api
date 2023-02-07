const db = require("../models");
const Distributor = db.distributor;

exports.getDistributorDropdown = function(req, res) {
	Distributor.find({isActive: true, isDeleted: false, plant: {$ne: '1000'}}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    let plantCode = [];
    let finalResult = [];    
    result.forEach(element => {
    	if (!plantCode.includes(element.plant)) {
    		plantCode.push(element.plant);
    		const tempResult = { id: element.plant, name:element.plant+' - '+element.organization};
    		finalResult.push(tempResult);
    	}
    });

    res.status(200).send({status:200, message:'Success', data:finalResult});
  }).sort({organization: 1});
}