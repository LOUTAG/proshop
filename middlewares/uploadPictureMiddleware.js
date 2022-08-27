const multer = require("multer");
//1 - STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "client/public/images");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    file.filename = uniqueName;
    cb(null, uniqueName);
  },
});

//2- FILE TYPE CHECKING
const fileFilter = (req, file, cb) => {
  //check file type
  if (file.mimetype.startsWith("image")) {
    cb(null, true); //null = no error & true = success
  } else {
    cb(new Error("File not accepted"), false); //first params is action
    //second is if error or not false = error
  }
};

const uploadPictureMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 300000,
  },
  fileFilter: fileFilter,
});

module.exports = uploadPictureMiddleware;
