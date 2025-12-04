const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.js");
const { uploadMedia, uploadMultipleImages } = require("../controllers/upload.controller.js");

router.post("/media", upload.single("file"), uploadMedia);
router.post("/multiple", upload.array("images", 10), uploadMultipleImages);

module.exports = router;
