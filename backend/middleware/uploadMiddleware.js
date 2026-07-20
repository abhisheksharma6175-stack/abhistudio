const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const allowed = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  const valid = allowed.test(ext);
  cb(null, valid);
}

const upload = multer({ storage, fileFilter });
module.exports = upload;
