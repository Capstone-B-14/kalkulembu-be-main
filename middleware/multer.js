const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, process.env.FILE_UPLOAD_PATH)); // Adjust the destination directory
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    const cowId = req.params.cowId; // Extract cowId from the route parameters
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `photo_${cowId}_${uniqueSuffix}${extname}`);
  },
});

// Check if the uploaded file is an image
function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

// Create the multer instance with the configured options
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: process.env.MAX_FILE_UPLOAD, // Set your file size limit
  },
});

module.exports = upload;
