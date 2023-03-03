const xlsx = require('xlsx');
const fs = require('fs');
const multer = require('multer');
const moment = require('moment');

const uploadFile = require("../middlewares/uploadBatch");

const db = require("../models");
const { Console } = require('console');
const Batch = db.batch;

// Batch excel importing/uploading and enter records in database
exports.importBatch = async (req, res) => {
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
    const filePath = './public/uploads/batch/' + fileName;
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
        const expireOn = item['SLED/BBD'] ? moment(new Date(item['SLED/BBD'])).add(1,'days').format("YYYY-MM-DD") : '';
        return { 
          code: item.Material,
          name: item['Material Description'],
          division: item.Division,
          divisionName: item['Division Name'],
          batch: item.Batch,
          expireOn: expireOn
        };
      });

      (async function(){
        const removeAll = await Batch.remove({});   // Remove all documents before insert.
        
        const insertMany = await Batch.insertMany(newArray);
        resolve({status:200, message: "Data added successfully."});
      })();
    } else {
      return res.status(200).send({status:400, message: "This file has more than 1 lakh rows, please upload it by reducing it."});
    }
  });
};


/*exports.convertExcelToJson = async (req, res) => {
  const filePath = './public/uploads/batch/' + fileName;
  if (!filePath) {
    return res.status(200).send({status:400, message: 'FilePath is null!'});
  }

  // Read the file using pathname
  const file = xlsx.readFile(filePath, { type: 'binary' , cellDates: true });
  if (!file.SheetNames) {
    return res.status(200).send({status:400, message: "Worksheet's name or ressource was not found."});
  }

  // Grab the sheet info from the file
  const sheetNames = file.SheetNames;
  const totalSheets = sheetNames.length;

  // Variable to store our data 
  let parsedData = [];

  // Loop through sheets
  //for (let i = 0; i < totalSheets; i++) {
    // Convert to json using xlsx
    const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[0]]);
    if (tempData.length == 0) {
      console.log('File content is empty.');
      return res.status(200).send({status:400, message: "File content is empty."});
    }
    console.log('tempData.length---', tempData.length);

    if (tempData.length <= 100100) {
      // Skip header row which is the colum names
      // tempData.shift();

      // Add the sheet's json to our data array
      parsedData.push(...tempData);
      
      // change key name in array of objects
      const newArray = parsedData.map(item => {
        const expireOn = item['SLED/BBD'] ? moment(new Date(item['SLED/BBD'])).add(1,'days').format("YYYY-MM-DD") : '';
        return { 
          materialCode: item.Material,
          name: item['Material Description'],
          divSAPcode: item.Division,
          division: item['Division Name'],
          batch: item.Batch,
          expireOn: expireOn,
          status: 1,
          batch101: item.Batch101,
          batch201: item.Batch201,
          batch301: item.Batch301,
          batch401: item.Batch401,
          materialCode1: item.Material,
          name1: item['Material Description'],
          divSAPcode1: item.Division,
          division1: item['Division Name'],
          batch1: item.Batch,
          expireOn1: expireOn,
          status1: 1,
          batch11: item.Batch11,
          batch21: item.Batch21,
          batch31: item.Batch31,
          batch41: item.Batch41,
          materialCode2: item.Material2,
          name2: item['Material Description2'],
          divSAPcode2: item.Division2,
          division2: item['Division Name2'],
          batch2: item.Batch2,
          expireOn2: expireOn,
          status2: 1,
          batch1012: item.Batch1012,
          batch2012: item.Batch2012,
          batch3012: item.Batch3012,
          batch4012: item.Batch4012,
          materialCode12: item.Material2,
          name12: item['Material Description2'],
          divSAPcode12: item.Division2,
          division12: item['Division Name2'],
          batch12: item.Batch2,
          expireOn12: expireOn,
          status12: 1,
          batch112: item.Batch112,
          batch212: item.Batch212,
          batch312: item.Batch312,
          batch412: item.Batch412
        };
      });

      // call a function to save the data in a json file
      //generateJSONFile(parsedData);

      (async function(){
        const insertMany = await Batch.insertMany(newArray);
        // console.log(JSON.stringify(insertMany,'','\t'));
        res.status(200).send({status:200, message: "Data updated successfully."});
      })();
    } else {
      return res.status(200).send({status:400, message: "This file has more than 1 lakh rows, please upload it by reducing it."});
    }
  //}
};*/

exports.matchBatch = async (req, res) => {
  const batches = [req.body.batch];

  const match = ['R', 'I', 'P', 'F', 'B', '8', 'O', 'Q', 'D', '0', 'G', '1', 'S', '5', 'L'];
  const repl1 = ['F', '1', 'I', 'E', '8', 'B', '0', 'D', 'O', 'O', '6', 'I', '5', 'S', '1'];
  const repl2 = ['P', 'E', 'E', 'I', 'F', 'F', 'Q', 'O', '0', 'D', '0', 'L'];
  const repl3 = ['F', 'F', 'F', 'P', 'P', 'P', 'D', '0', 'Q', 'Q'];
  const repl4 = ['B', 'B', 'B', 'B'];
  /* const replace = [
    {
      0: 'D',
      1: '8',
      2: 'Q'
    },
    {
      0: '0',
      1: 'F',
      2: 'O'
    },
    {
      0: 'O',
      1: 'P',
      2: '0'
    }
  ]; */
  

  const batch = req.body.batch.split('');

  /* batch.forEach( async (element, index) => {
    //const index = 0;
    const key = Object.keys(match).find(k => match[k] === element);
    console.log('index---', index, element, key);
    if (key) {
      //for (let j=0; j<3; j++) {
        const beforeMatch = req.body.batch.substr(0, index);
        const afterMatch = req.body.batch.substr(index+1, batch.length);
        console.log('afterMatch--', index, afterMatch);
        for (let i=0; i<3; i++) {
          // console.log('replace---', i, replace[i][key]);
          const result = beforeMatch + replace[i][key] + afterMatch;
          batches.push(result);
        }
        if (afterMatch) {

        }
      //}
    }
  }); */

  batch.forEach((element, index) => {
    const key = Object.keys(match).find(k => match[k] === element);
    if (key) {
      if (repl1[key]) {
        let beforeMatch = req.body.batch.substr(0, index);
        let afterMatch = req.body.batch.substr(index+1, batch.length);
        let result = beforeMatch + repl1[key] + afterMatch;
        batches.push(result);
      }
      if (repl2[key]) {
        let beforeMatch = req.body.batch.substr(0, index);
        let afterMatch = req.body.batch.substr(index+1, batch.length);
        let result = beforeMatch + repl2[key] + afterMatch;
        batches.push(result);
      }
      if (repl3[key]) {
        let beforeMatch = req.body.batch.substr(0, index);
        let afterMatch = req.body.batch.substr(index+1, batch.length);
        let result = beforeMatch + repl3[key] + afterMatch;
        batches.push(result);
      }
      if (repl4[key]) {
        let beforeMatch = req.body.batch.substr(0, index);
        let afterMatch = req.body.batch.substr(index+1, batch.length);
        let result = beforeMatch + repl4[key] + afterMatch;
        batches.push(result);
      }
    }
  });
  //console.log('batches---', batches);

  /* batch.forEach((element, index) => {
    let val1 = '';
    let val2 = '';
    let val3 = '';
    let val4 = '';
    const key = Object.keys(match).find(k => match[k] === element);
    
    batch.forEach((ele, ind) => {
      if (key && index == ind) {
        val1 = repl1[key] ? val1 + repl1[key] : val1 + ele;
        val2 = repl2[key] ? val2 + repl2[key] : val2 + ele;
        val3 = repl3[key] ? val3 + repl3[key] : val3 + ele;
        val4 = repl4[key] ? val4 + repl4[key] : val4 + ele;
      } else {
        val1 = val1 + ele;
        val2 = val2 + ele;
        val3 = val3 + ele;
        val4 = val4 + ele;
      }
    });
    batches.push(val1);
    batches.push(val2);
    batches.push(val3);
    batches.push(val4);
  }); */

  const unique = batches.filter((v, i, a) => a.indexOf(v) === i);
  console.log('batches - ', unique);

  Batch.find({ batch: {$in: unique}}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    const uniqueResult = [...new Set(result.map(item => item.batch))];    // output batch no. only.
    //const uniqueResult = [...new Map(result.map(item => [item['batch'], item])).values()];    // results Full details
    res.status(200).send({status:200, message:'Success', data:uniqueResult});
  }).sort({batch: 1});
};

let getWords = (batch, index, match, repl1, repl2, repl3, repl4) => {
    const batches = [];
    const splitBatch = batch.split('');
    for (let i=index+1; i<splitBatch.length; i++) {
      const key = Object.keys(match).find(k => match[k] === splitBatch[i]);
      if (key) {
        if (repl1[key]) {
          let beforeMatch = batch.substr(0, i);
          let afterMatch = batch.substr(i+1, batch.length);
          let result = beforeMatch + repl1[key] + afterMatch;
          batches.push(result);

          if (index <= batch.length) {
            // getWords(batch, i, match, repl1, repl2, repl3, repl4);
          }
        }
        if (repl2[key]) {
          let beforeMatch = batch.substr(0, i);
          let afterMatch = batch.substr(i+1, batch.length);
          let result = beforeMatch + repl2[key] + afterMatch;
          batches.push(result);

          if (index <= batch.length) {
            // getWords(batch, i, match, repl1, repl2, repl3, repl4);
          }
        }
        if (repl3[key]) {
          let beforeMatch = batch.substr(0, i);
          let afterMatch = batch.substr(i+1, batch.length);
          let result = beforeMatch + repl3[key] + afterMatch;
          batches.push(result);

          if (index <= batch.length) {
            // getWords(batch, i, match, repl1, repl2, repl3, repl4);
          }
        }
        if (repl4[key]) {
          let beforeMatch = batch.substr(0, i);
          let afterMatch = batch.substr(i+1, batch.length);
          let result = beforeMatch + repl4[key] + afterMatch;
          batches.push(result);

          if (index <= batch.length) {
            // getWords(batch, i, match, repl1, repl2, repl3, repl4);
          }
        }
      }
    }

    if (batches) {
      return(batches);
    }
}