const xlsx = require('xlsx');
const fs = require('fs');
const multer = require('multer');
const moment = require('moment');

const uploadFile = require("../middlewares/uploadPriceWithTax");
const uploadFile2 = require("../middlewares/uploadPriceWithoutTax");

const db = require("../models");
const ProductPriceWithTax = db.product_price_with_tax;
const ProductPriceWithoutTax = db.product_price_without_tax;

exports.importPriceWithTax = async (req, res) => {
  try {
    // To upload file
    await uploadFile(req, res);

    // Functionality after upload
    if (req.file == undefined) {
      return res.status(200).send({status:400, message: "Please upload a file!" });
    }

    // Insert records in database
    const finalResult = await convertExcelToJson(req.file.originalname);
    res.status(200).send(finalResult);
  } catch (err) {
    res.status(200).send({status:500, message: `Could not upload the file: ${err}`});
  }
};

let convertExcelToJson  = (fileName) => {
  return new Promise(resolve => {
    const filePath = './public/uploads/priceWithTax/' + fileName;
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
    if (tempData.length == 0) {
      resolve({status:400, message: 'File content is empty.'});
    }

    if (tempData.length <= 100100) {
      // Add the sheet's json to our data array
      parsedData.push(...tempData);

      // change key name in array of objects
      const newArray = parsedData.map(item => {
        return { 
          material: item.Material,
          materialDesc: item['Material Name'],
          division: item.Division,
          packageSize: item['Package Size'],
          9001: item['9001'],
          9002: item['9002'],
          9003: item['9003'],
          9004: item['9004'],
          9005: item['9005'],
          9006: item['9006'],
          9007: item['9007'],
          9008: item['9008'],
          9009: item['9009'],
          9010: item['9010'],
          9011: item['9011'],
          9012: item['9012'],
          9013: item['9013'],
          9014: item['9014'],
          9015: item['9015'],
          9016: item['9016'],
          9017: item['9017'],
          9018: item['9018'],
          9019: item['9019'],
          9020: item['9020'],
          9021: item['9021'],
          9022: item['9022'],
          9023: item['9023'],
          9024: item['9024'],
          9025: item['9025'],
          9026: item['9026'],
          9027: item['9027']
        };
      });

      (async function(){
        const removeAll = await ProductPriceWithTax.deleteMany({});   // Remove all documents before insert.
        
        const insertMany = await ProductPriceWithTax.insertMany(newArray);
        resolve({status:200, message: "Data added successfully."});
      })();
    } else {
      return res.status(200).send({status:400, message: "This file has more than 1 lakh rows, please upload it by reducing it."});
    }
  });
};

exports.importPriceWithoutTax = async (req, res) => {
  try {
    // To upload file
    await uploadFile2(req, res);

    // Functionality after upload
    if (req.file == undefined) {
      return res.status(200).send({status:400, message: "Please upload a file!" });
    }

    // Insert records in database
    const finalResult = await convertExcelToJson2(req.file.originalname);
    res.status(200).send(finalResult);
  } catch (err) {
    res.status(200).send({status:500, message: `Could not upload the file: ${err}`});
  }
};

let convertExcelToJson2  = (fileName) => {
  return new Promise(resolve => {
    const filePath = './public/uploads/priceWithoutTax/' + fileName;
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
    if (tempData.length == 0) {
      resolve({status:400, message: 'File content is empty.'});
    }

    if (tempData.length <= 100100) {
      // Add the sheet's json to our data array
      parsedData.push(...tempData);

      // change key name in array of objects
      const newArray = parsedData.map(item => {
        return { 
          material: item.Material,
          materialDesc: item['Material Name'],
          division: item.Division,
          packageSize: item['Package Size'],
          9001: item['9001'],
          9002: item['9002'],
          9003: item['9003'],
          9004: item['9004'],
          9005: item['9005'],
          9006: item['9006'],
          9007: item['9007'],
          9008: item['9008'],
          9009: item['9009'],
          9010: item['9010'],
          9011: item['9011'],
          9012: item['9012'],
          9013: item['9013'],
          9014: item['9014'],
          9015: item['9015'],
          9016: item['9016'],
          9017: item['9017'],
          9018: item['9018'],
          9019: item['9019'],
          9020: item['9020'],
          9021: item['9021'],
          9022: item['9022'],
          9023: item['9023'],
          9024: item['9024'],
          9025: item['9025'],
          9026: item['9026'],
          9027: item['9027']
        };
      });

      (async function(){
        const removeAll = await ProductPriceWithoutTax.deleteMany({});   // Remove all documents before insert.
        
        const insertMany = await ProductPriceWithoutTax.insertMany(newArray);
        resolve({status:200, message: "Data added successfully."});
      })();
    } else {
      return res.status(200).send({status:400, message: "This file has more than 1 lakh rows, please upload it by reducing it."});
    }
  });
};