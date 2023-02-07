const xlsx = require('xlsx');
const moment = require('moment');

const uploadFile = require("../middlewares/uploadSales");
const uploadPHPFile = require("../middlewares/uploadPhpSales");

const db = require("../models");
const Sales = db.sales;
const Batch = db.batch;
const Stockiest = db.stockiest;
const ProductShelflife = db.product_shelflife;
const ProductMultiplier = db.product_multiplier;
const ProductPriceWithTax = db.product_price_with_tax;
const ProductPriceWithoutTax = db.product_price_without_tax;


exports.getSales = async function(req, res) {
  const division = req.body.division;

  const stockiest = await getStockiest(req.body.plant);
  
  let monthYearQuery = {};
  if (req.body.dateRange.length >= 2) {
    const startDate = moment(req.body.dateRange[0],'YYYY-MM-DD[T]00:00:00.000[Z]').format('YYYY-MM-01');
    const endDate = moment(req.body.dateRange[parseInt(req.body.dateRange.length)-1],'YYYY-MM-DD[T]00:00:00.000[Z]').format('YYYY-MM-01');
    monthYearQuery = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else {
    const startDate = moment(req.body.dateRange[0],'YYYY-MM-DD[T]00:00:00.000[Z]').format('YYYY-MM-01');
    monthYearQuery = { $eq: new Date(startDate) };
  }
  
  const matchQuery = {
    plant: req.body.plant,
    billDocType: { $ne: 'ZCRF' },
    division: { $in: division },
    billToParty: { $nin: stockiest },
    monthYear: monthYearQuery,
  }
  console.log('matchQuery---', matchQuery);

  Sales.aggregate([
    {
      $match: matchQuery
    }, {
      $group: {
        _id: { material:"$material", monthYear: "$monthYear" },
        monthYear: { $first: "$monthYear" },
        division: { $first: "$division" },
        divisionName: { $first: "$divisionName" },
        material: { $first: "$material" },
        name: { $first: "$materialDesc" },
        totalQty: { $sum: "$salesQty" }
      }
    }, {
      $project: {
        division: 1,
        divisionName: 1,
        name: 1,
        monthYear: 1,
        material: 1,
        totalQty: 1
      }
    }, {
      $sort: { 
        division: 1,
        monthYear: 1,
        name: 1
      }
   }
  ]).exec((error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
};

let getStockiest = (plantCode) => {
  return new Promise(resolve => {
    let stockiestId = [];
    Stockiest.find({plant: plantCode, status: 1}, (error, result) => {
      if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
      if (result && result.length) {
        result.map(item => {
          stockiestId.push(item.customerId);
        });
        resolve(stockiestId);
      } else {
        resolve(stockiestId);
      }
    });
  });
}

exports.getGiftSales = async function(req, res) {
  const stockiest = await getGiftStockiest();

  const date = moment(req.body.monthyear).add(1, 'D').format('YYYY-MM-01');
  const matchQuery = {
    monthYear: new Date(date),
    plant: { $nin: ['2200','3300'] },
    billToParty: { $nin: stockiest }
  }
  
  if (req.body.type == 1) {
    Sales.aggregate([
      {
        $match: matchQuery
      }, {
        $group: {
          _id: { plant:"$plant", division:"$division", billToParty:"$billToParty" },
          monthYear: { $first: "$monthYear" },
          plant: { $first: "$plant" },
          billToParty: { $first: "$billToParty" },
          billToPartyName: { $first: "$billToPartyName" },
          billPartyCity: { $first: "$billPartyCity" },
          division: { $first: "$division" },
          divisionName: { $first: "$divisionName" },
          totalQty: { $sum: "$netValue" }
        }
      }, { 
        $sort: { billToPartyName: 1, divisionName: 1 } 
      }
    ]).exec((error, result) => {
      if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
      if (!result) return res.status(200).send({status:400, message: 'noRecord'});
      
      res.status(200).send({status:200, message:'Success', data:result});
    });
  } else {
    Sales.aggregate([
      {
        $match: matchQuery
      }, {
        $group: {
          _id: { plant:"$plant", billToParty:"$billToParty" },
          monthYear: { $first: "$monthYear" },
          plant: { $first: "$plant" },
          billToParty: { $first: "$billToParty" },
          billToPartyName: { $first: "$billToPartyName" },
          billPartyCity: { $first: "$billPartyCity" },
          totalQty: { $sum: "$netValue" }
        }
      }, { 
        $sort: { billToPartyName: 1 } 
      }
    ]).exec((error, result) => {
      if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
      if (!result) return res.status(200).send({status:400, message: 'noRecord'});
      
      res.status(200).send({status:200, message:'Success', data:result});
    });
  }

}

let getGiftStockiest = () => {
  return new Promise(resolve => {
    let stockiestId = [];
    Stockiest.find({status: 1}, (error, result) => {
      if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
      if (result && result.length) {
        result.map(item => {
          stockiestId.push(item.customerId);
        });
        resolve(stockiestId);
      } else {
        resolve(stockiestId);
      }
    });
  });
}

exports.importDistSales = async (req, res) => {
  try {
    // To upload file
    await uploadFile(req, res);

    // Functionality after upload
    if (req.file == undefined) {
      return res.status(200).send({status:400, message: "Please upload a file!" });
    }

    const my = req.body.year+'-'+req.body.month;
    const monthYear = moment(my,'YYYY-MM').format('YYYY-MM-01');

    // Insert records in database
    const finalResult = await convertDistExcelToJson(req.file.originalname, req.body.month, req.body.year, monthYear);
    res.status(200).send(finalResult);
  } catch (err) {
    res.status(200).send({status:500, message: `Could not upload the file: ${err}`});
  }
}

let convertDistExcelToJson  = (fileName, month, year, monthYear) => {
  return new Promise(async resolve => {
    const filePath = './public/uploads/sales/' + fileName;
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

    const batches = await getBatch();
    
    const totalRow = tempData.length;
    if (totalRow == 0) {
      resolve({status:400, message: 'File content is empty.'});
    }

    console.log('totalRow(Dist Sales)--', totalRow);
    if (totalRow <= 100100) {
      // Find the match and remove records if exists 
      // Division HO, 00, 07 and 91 has no need in reports.
      const filteredData = tempData.filter(temp =>
        temp.Division != undefined &&
        temp.Division != NaN &&
        temp.Division != ''
      );

      // change key name in array of objects
      const newArray = filteredData.map(item => {
        const billDocDate = item['Bill Doc Date'] ? moment(new Date(item['Bill Doc Date'])).add(1,'days').format("YYYY-MM-DD") : '';

        const temp = batches.filter(function (d) {
          // return d.batch.indexOf(item['Batch No']) !== -1 || !item['Batch No'];
          return d.batch === item['Batch No']
        });
        
        const expireOn = (temp.length<=0 || temp.length > 5) ? null : temp[0].expireOn;

        return {
          plant:            item.Plant,
          billDocNumber:    item['Bill DocNo'],
          billDocDate:      billDocDate,
          billDocType:      item['Bill Doc Type'],
          billToParty:      item['Bill-To-Party'],
          billToPartyName:  item['Bill-To-Party Name'],
          division:         item.Division,
          divisionName:     item['Div Name'],
          material:         item.Material,
          materialDesc:     item['Material Description'],
          batchNo:          item['Batch No'],
          salesQty:         item['Material Qty In Sale Unit'],
          netValue:         item['Net Value'],
          itemCategory:     item['Item Category'],
          salesOrg:         item['Sales Organization'],
          distChannel:      item['Distribution Channel'],
          salesRegion:      item['Sales Region'],
          storageLocation:  item['Storage Location'],
          paymentTermDesc:  item['Payment terms Desc'],
          gstNo:            item['GST No.'],
          billPartyCity:    item['Bill-To-Party City'],
          salesUom:         item['Sales UOM'],
          mrpValue:         item['MRP Value'],
          billValue:        item['Bill Value'],
          totalValue:       item['TOT Value'],
          roundOfValue:     item['Rounding Off Value'],
          discount:         item['Discount'],
          expireOn:         expireOn,
          month:            month,
          year:             year,
          monthYear:        monthYear
        }
      });

      (async function(){
        const insertMany = await Sales.insertMany(newArray);
        resolve({status:200, message: "Data added successfully."});
      })();
    } else {
      //return res.status(200).send({status:400, message: "There are more than 1 lakh rows in this file, more than 1 lakh rows cannot be uploaded at a time, please upload it by reducing the number of rows."});
      resolve({status:400, message: 'There are more than 1 lakh rows in this file, more than 1 lakh rows cannot be uploaded at a time, please upload it by reducing the number of rows.'});
    }
  });
}

let getBatch  = () => {
  return new Promise(resolve => {
    Batch.find({}, (error, result) => {
      if (error) {
        resolve([]);
      } else {
        resolve(result);
      }
    });
  });
}

exports.importHoSales = async (req, res) => {
  try {
    // To upload file
    await uploadFile(req, res);

    // Functionality after upload
    if (req.file == undefined) {
      return res.status(200).send({status:400, message: "Please upload a file!" });
    }

    const my = req.body.year+'-'+req.body.month;
    const monthYear = moment(my,'YYYY-MM').format('YYYY-MM-01');

    // Insert records in database
    const finalResult = await convertHoExcelToJson(req.file.originalname, req.body.month, req.body.year, monthYear);
    res.status(200).send(finalResult);
  } catch (err) {
    res.status(200).send({status:500, message: `Could not upload the file: ${err}`});
  }
}

let convertHoExcelToJson  = (fileName, month, year, monthYear) => {
  return new Promise(async resolve => {
    const filePath = './public/uploads/sales/' + fileName;
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

    const batches = await getBatch();
    
    const totalRow = tempData.length;
    if (totalRow == 0) {
      resolve({status:400, message: 'File content is empty.'});
    }

    console.log('totalRow--', totalRow);
    if (totalRow <= 100100) {
      // Find the match and remove records if exists 
      // Division HO, 00, 07 and 91 has no need in reports.
      const filteredData = tempData.filter(temp =>
        temp.Division != undefined &&
        temp.Division != NaN &&
        temp.Division != ''
      );

      // change key name in array of objects
      const newArray = filteredData.map(item => {
        const billDocDate = item['Bill Doc Date'] ? moment(new Date(item['Bill Doc Date'])).add(1,'days').format("YYYY-MM-DD") : '';

        const temp = batches.filter(function (d) {
          // return d.batch.indexOf(item['Batch No']) !== -1 || !item['Batch No'];
          return d.batch === item['Batch No']
        });
        
        const expireOn = (temp.length<=0 || temp.length > 5) ? null : temp[0].expireOn;

        return {
          plant:            item.Plant,
          billDocNumber:    item['Bill DocNo'],
          billDocDate:      billDocDate,
          billDocType:      item['Bill Doc Type'],
          billToParty:      item['Bill-To-Party'],
          billToPartyName:  item['Bill-To-Party Name'],
          division:         item.Division,
          divisionName:     item['Div Name'],
          material:         item.Material,
          materialDesc:     item['Material Description'],
          batchNo:          item['Batch No'],
          salesQty:         item['Material Qty In Sale Unit'],
          netValue:         item['NRV'],
          itemCategory:     item['Item Category'],
          salesOrg:         item['Sales Organization'],
          distChannel:      item['Distribution Channel'],
          salesRegion:      item['Sales Region'],
          storageLocation:  item['Storage Location'],
          paymentTermDesc:  item['Payment terms Desc'],
          gstNo:            item['GST No.'],
          billPartyCity:    item['Bill-To-Party City'],
          salesUom:         item['Sales UOM'],
          mrpValue:         item['MRP Value'],
          billValue:        item['PTD Value'],
          totalValue:       item['TOT Value'],
          roundOfValue:     item['Rounding Off Value'],
          discount:         item['Discount'],
          expireOn:         expireOn,
          month:            month,
          year:             year,
          monthYear:        monthYear
        }
      });

      (async function(){
        const insertMany = await Sales.insertMany(newArray);
        resolve({status:200, message: "Data added successfully."});
      })();
    } else {
      //return res.status(200).send({status:400, message: "There are more than 1 lakh rows in this file, more than 1 lakh rows cannot be uploaded at a time, please upload it by reducing the number of rows."});
      resolve({status:400, message: 'There are more than 1 lakh rows in this file, more than 1 lakh rows cannot be uploaded at a time, please upload it by reducing the number of rows.'});
    }
  });
}

exports.importPHPSales = async (req, res) => {
  try {
    // To upload file
    await uploadPHPFile(req, res);

    // Functionality after upload
    if (req.file == undefined) {
      return res.status(200).send({status:400, message: "Please upload a file!" });
    }

    // Insert records in database
    const finalResult = await convertPHPExcelToJson(req.file.originalname, req.body.month, req.body.year, req.body.monthYear);
    res.status(200).send(finalResult);
  } catch (err) {
    res.status(200).send({status:500, message: `Could not upload the file: ${err}`});
  }
}

let convertPHPExcelToJson  = (fileName, month, year, monthYear) => {
  return new Promise(async resolve => {
    const filePath = './public/uploads/sales/php/' + fileName;
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
      // change key name in array of objects
      const newArray = tempData.map(item => {
        const billDocDate = item['Bill Doc Date'] ? moment(new Date(item['Bill Doc Date'])).add(1,'days').format("YYYY-MM-DD") : '';

        return {
          plant:            item.Plant,
          billDocNumber:    item.BillDocNumber,
          billDocDate:      item.BillDocDate,
          billDocType:      item.BillDocType,
          billToParty:      item.BillToParty,
          billToPartyName:  item.BillToPartyName,
          division:         item.Division,
          divisionName:     item.DivisionName,
          material:         item.Material,
          materialDesc:     item.MaterialDesc,
          batchNo:          item.BatchNo,
          salesQty:         item.SalesQty,
          netValue:         item.NetValue,
          itemCategory:     item.ItemCategory,
          salesOrg:         item.SalesOrg,
          distChannel:      item.DistChannel,
          salesRegion:      item.SalesRegion,
          storageLocation:  item.StorageLocation,
          paymentTermDesc:  item.PaymentTermDesc,
          gstNo:            item['GST No'],
          billPartyCity:    item.BillPartyCity,
          salesUom:         item.SalesUom,
          mrpValue:         item['MRP Value'],
          billValue:        item.BillValue,
          totalValue:       item.TotalValue,
          roundOfValue:     item.RoundOfValue,
          discount:         item.Discount,
          expireOn:         item.ExpireOn,
          month:            month,
          year:             year,
          monthYear:        monthYear
        }
      });

      (async function(){
        const insertMany = await Sales.insertMany(newArray);
        resolve({status:200, message: "Data added successfully."});
      })();
    } else {
      return res.status(200).send({status:400, message: "There are more than 1 lakh rows in this file, more than 1 lakh rows cannot be uploaded at a time, please upload it by reducing the number of rows."});
    }
  });
}


exports.getProductPriceWithTaxByMaterials = function(req, res) {
  ProductPriceWithTax.find({
    material: { $in: req.body.materials }
  }, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
}

exports.getProductPriceWithoutTaxByMaterials = function(req, res) {
  ProductPriceWithoutTax.find({
    material: { $in: req.body.materials }
  }, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
}

exports.getProductsMultiplier = function(req, res) {
  ProductMultiplier.find({
    material: { $in: req.body.materials },
    status: 1
  }, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
}

exports.getProductShelflife = function(req, res) {
  ProductShelflife.find({
    material: { $in: req.body.materials }
  }, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
}