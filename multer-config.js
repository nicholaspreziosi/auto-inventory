// multer-config.js
const multer = require("multer");
// const storage = multer.memoryStorage(); // store image in memory
// const upload = multer({ storage: storage });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const date = Date.now();
    cb(null, `${date}_${file.originalname}.jpg`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
