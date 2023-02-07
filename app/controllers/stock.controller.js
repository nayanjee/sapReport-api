const xlsx = require('xlsx');
const moment = require('moment');

const uploadFile = require("../middlewares/uploadStocks");
const uploadPHPFile = require("../middlewares/uploadPhpStocks");

const db = require("../models");
const Sales = db.sales;
const Stocks = db.stocks;
const Product = db.products;

exports.getStocks = function(req, res) {
  Stocks.aggregate([
    {
      $match: {
        plant: req.body.plant,
        division: { $in: req.body.division },
        monthYear: { $eq: new Date(req.body.monthYear) }
      }
    }, {
      $group: {
        _id: { division: "$division", monthYear: "$monthYear",  materialDesc: "$materialDesc"},
        division: { $first: "$division" },
        divisionName: { $first: "$divisionName" },
        monthYear: { $first: "$monthYear" },
        materialDesc: { $first: "$materialDesc" },
        material: { $first: "$material" },
        totalQty: { $sum: "$stockQty" },
        totalValue:  { $sum: "$value" }
      }
    }, {
      $project: {
        division: 1,
        divisionName: 1,
        materialDesc: 1,
        monthYear: 1,
        material: 1,
        totalQty: 1,
        totalValue: 1
      }
    }, {
      $sort: { 
        division: 1
      }
    }
  ]).exec((error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
};

exports.importPHPStocks = async (req, res) => {
  try {
    // To upload file
    await uploadPHPFile(req, res);

    // Functionality after upload
    if (req.file == undefined) {
      return res.status(200).send({status:400, message: "Please upload a file!" });
    }

    const dateTime = moment().format("YYYYMMDDhhmmss");
    const fileName = req.file.originalname.split('.');
    const finalFileName = fileName[0]+'_'+dateTime+'.'+fileName[1];

    const my = req.body.year+'-'+req.body.month;
    const monthYear = moment(my,'YYYY-MM').format('YYYY-MM-01');
    console.log('monthYear---', monthYear);


    // Insert records in database
    const finalResult = await convertPHPExcelToJson(finalFileName, req.body.month, req.body.year, monthYear);
    res.status(200).send(finalResult);
  } catch (err) {
    res.status(200).send({status:500, message: `Could not upload the file: ${err}`});
  }
}

let convertPHPExcelToJson  = (fileName, month, year, monthYear) => {
  return new Promise(async resolve => {
    const filePath = './public/uploads/stocks/php/' + fileName;
    if (!filePath) {
      resolve({status:400, message: 'FilePath is null!'});
    }

    // Read the file using pathname
    const file = xlsx.readFile(filePath, { type: 'binary' , cellDates: true });
    if (!file.SheetNames) {
      resolve({status:400, message: "Worksheet's name or ressource was not found."});
    }
    
    // Grab the sheet info from the file
    const sheetNames = file.SheetNames;

    // Variable to store our data 
    let parsedData = [];

    // Convert to json using xlsx
    const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[0]]);
    //console.log('tempData---', tempData);
    
    const totalRow = tempData.length;
    if (totalRow == 0) {
      resolve({status:400, message: 'File content is empty.'});
    }

    if (tempData.length <= 100100) {
      // console.log('tempData---', tempData);

      // change key name in array of objects
      const newArray = tempData.map(item => {
        const expireOn = item['ExpireOn'] ? moment(new Date(item['ExpireOn'])).add(1,'days').format("YYYY-MM-DD") : '';

        return {
          plant:            item.Plant,
          division:         item.Division,
          divisionName:     item.DivisionName,
          material:         item.Material,
          materialDesc:     item.MaterialDesc,
          stockQty:         item.StockQty,
          batchNo:          item.BatchNo,
          value:            item.Value,
          transitStock:     item.TransitStock,
          transitValue:     item.TransitValue,
          expireOn:         expireOn,
          month:            month,
          year:             year,
          monthYear:        monthYear
        }
      });

      //console.log('newArray---', newArray);
      (async function(){
        const insertMany = await Stocks.insertMany(newArray);
        resolve({status:200, message: "Data added successfully."});
      })();
    } else {
      return res.status(200).send({status:400, message: "There are more than 1 lakh rows in this file, more than 1 lakh rows cannot be uploaded at a time, please upload it by reducing the number of rows."});
    }
  });
}

exports.importHoStocks = async (req, res) => {
  try {
    // To upload file
    await uploadFile(req, res);

    // Functionality after upload
    if (req.file == undefined) {
      return res.status(200).send({status:400, message: "Please upload a file!" });
    }

    const dateTime = moment().format("YYYYMMDDhhmmss");
    const fileName = req.file.originalname.split('.');
    const len = parseInt(fileName.length) - 1;
    const finalFileName = fileName[0]+'_'+dateTime+'.'+fileName[len];

    const my = req.body.year+'-'+req.body.month;
    const monthYear = moment(my,'YYYY-MM').format('YYYY-MM-01');

    // Insert records in database
    const finalResult = await convertHOExcelToJson(finalFileName, req.body.month, req.body.year, monthYear);
    res.status(200).send(finalResult);
  } catch (err) {
    res.status(200).send({status:500, message: `Could not upload the file: ${err}`});
  }
}

let convertHOExcelToJson  = (fileName, month, year, monthYear) => {
  return new Promise(async resolve => {
    const filePath = './public/uploads/stocks/sap/' + fileName;
    if (!filePath) {
      resolve({status:400, message: 'FilePath is null!'});
    }
    console.log('filePath---', filePath);

    // Read the file using pathname
    const file = xlsx.readFile(filePath, { type: 'binary' , cellDates: true });
    if (!file.SheetNames) {
      resolve({status:400, message: "Worksheet's name or ressource was not found."});
    }
    
    // Grab the sheet info from the file
    const sheetNames = file.SheetNames;

    // Variable to store our data 
    let parsedData = [];

    // Convert to json using xlsx
    const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[0]]);
    //console.log('tempData---', tempData);
    
    const totalRow = tempData.length;
    if (totalRow == 0) {
      resolve({status:400, message: 'File content is empty.'});
    }

    if (tempData.length <= 100100) {
      // Find the match and remove records if exists 
      // Division HO, 00, 07 and 91 has no need in reports.
      const filteredData = tempData.filter(temp =>
        temp.Division != 'HO' && 
        temp.Division != '00' && 
        temp.Division != '07' && 
        temp.Division != '91' &&
        temp.Division != undefined &&
        temp.Division != NaN &&
        temp.Division != ''
      );

      // change key name in array of objects
      const newArray = filteredData.map(item => {
        const expireOn = item['SLED/BBD'] ? moment(new Date(item['SLED/BBD'])).add(1,'days').format("YYYY-MM-DD") : '';
        
        const UnrestrictedQty = item['Unrestricted Qty.'] != undefined ? item['Unrestricted Qty.'] : 0;
        const ValueUnrestricted = item['Value Unrestricted'] != undefined ? item['Value Unrestricted'] : 0;
        const ValueInQualInsp = item['Value in QualInsp.'] != undefined ? item['Value in QualInsp.'] : 0;
        const ValueBlockedStock = item['Value BlockedStock'] != undefined ? item['Value BlockedStock'] : 0;
        const stkQtyInspection = item['Stock in Quality Inspection'] != undefined ? item['Stock in Quality Inspection'] : 0;
        const Blocked = item.Blocked != undefined ? item.Blocked : 0;

        const stockQty = parseFloat(UnrestrictedQty) + parseFloat(stkQtyInspection) + parseFloat(Blocked);
        const value = parseFloat(ValueUnrestricted) + parseFloat(ValueInQualInsp) + parseFloat(ValueBlockedStock);

        return {
          plant:            item.Plant,
          division:         parseInt(item.Division),
          divisionName:     item['Division Name'],
          material:         item.Material,
          materialDesc:     item['Material Description'],
          stockQty:         stockQty,
          batchNo:          item.Batch,
          value:            value,
          transitStock:     0,
          transitValue:     0,
          expireOn:         expireOn,
          month:            month,
          year:             year,
          monthYear:        monthYear
        }
      });

      (async function(){
        const insertMany = await Stocks.insertMany(newArray);
        resolve({status:200, message: "Data added successfully."});
      })();
    } else {
      return res.status(200).send({status:400, message: "There are more than 1 lakh rows in this file, more than 1 lakh rows cannot be uploaded at a time, please upload it by reducing the number of rows."});
    }
  });
}

exports.importDistStocks = async (req, res) => {
  try {
    // To upload file
    await uploadFile(req, res);

    // Functionality after upload
    if (req.file == undefined) {
      return res.status(200).send({status:400, message: "Please upload a file!" });
    }

    const dateTime = moment().format("YYYYMMDDhhmmss");
    const fileName = req.file.originalname.split('.');
    const len = parseInt(fileName.length) - 1;
    const finalFileName = fileName[0]+'_'+dateTime+'.'+fileName[len];

    const my = req.body.year+'-'+req.body.month;
    const monthYear = moment(my,'YYYY-MM').format('YYYY-MM-01');

    // Insert records in database
    const finalResult = await convertDistExcelToJson(finalFileName, req.body.month, req.body.year, monthYear);
    res.status(200).send(finalResult);
  } catch (err) {
    res.status(200).send({status:500, message: `Could not upload the file: ${err}`});
  }
}

let convertDistExcelToJson  = (fileName, month, year, monthYear) => {
  return new Promise(async resolve => {
    const filePath = './public/uploads/stocks/sap/' + fileName;
    if (!filePath) {
      resolve({status:400, message: 'FilePath is null!'});
    }

    // Read the file using pathname
    const file = xlsx.readFile(filePath, { type: 'binary' , cellDates: true });
    if (!file.SheetNames) {
      resolve({status:400, message: "Worksheet's name or ressource was not found."});
    }
    
    // Grab the sheet info from the file
    const sheetNames = file.SheetNames;

    // Variable to store our data 
    let parsedData = [];

    // Convert to json using xlsx
    const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[0]]);
    //console.log('tempData---', tempData);
    
    const totalRow = tempData.length;
    if (totalRow == 0) {
      resolve({status:400, message: 'File content is empty.'});
    }

    if (tempData.length <= 100100) {
      // Find the match and remove records if exists 
      // Division HO, 00, 07 and 91 has no need in reports.
      const filteredData = tempData.filter(temp =>
        temp.Division != undefined &&
        temp.Division != NaN &&
        temp.Division != ''
      );

      // change key name in array of objects
      const newArray = filteredData.map(item => {
        const expireOn = item['Self-life Expiry Date'] ? moment(new Date(item['Self-life Expiry Date'])).add(1,'days').format("YYYY-MM-DD") : '';

        return {
          plant:            item.Plant,
          division:         parseInt(item.Division),
          divisionName:     item['Division Name'],
          material:         item['Material Code'],
          materialDesc:     item['Material Description'],
          stockQty:         item['Unrestricted Quantity'],
          batchNo:          item.Batch,
          value:            item['PTD Value'],
          transitStock:     0,
          transitValue:     0,
          expireOn:         expireOn,
          month:            month,
          year:             year,
          monthYear:        monthYear
        }
      });

      (async function(){
        const insertMany = await Stocks.insertMany(newArray);
        resolve({status:200, message: "Data added successfully."});
      })();
    } else {
      return res.status(200).send({status:400, message: "There are more than 1 lakh rows in this file, more than 1 lakh rows cannot be uploaded at a time, please upload it by reducing the number of rows."});
    }
  });
}
