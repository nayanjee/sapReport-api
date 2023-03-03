const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/public/uploads/shelflife");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  // limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
  	if (file.mimetype == "application/vnd.ms-excel" || file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .xls and .xlsx format allowed!'));
    }
  }
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;