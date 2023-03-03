const xlsx = require('xlsx');
const fs = require('fs');
const multer = require('multer');
const moment = require('moment');

const uploadFile = require("../middlewares/uploadShelflife");

const db = require("../models");
const ProductShelflife = db.product_shelflife;

exports.importProductShelflife = async (req, res) => {
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
    const filePath = './public/uploads/shelflife/' + fileName;
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
            division: item.Division,
            material: item.Material,
            materialDesc: item['Material Name'],
            shelfLife: item['Shelf Life']
        };
      });

      (async function(){
        const removeAll = await ProductShelflife.deleteMany({});   // Remove all documents before insert.
        
        const insertMany = await ProductShelflife.insertMany(newArray);
        resolve({status:200, message: "Data added successfully."});
      })();
    } else {
      return res.status(200).send({status:400, message: "This file has more than 1 lakh rows, please upload it by reducing it."});
    }
  });
};