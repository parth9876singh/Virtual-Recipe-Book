const express = require('express');
const router = express.Router();
const googleAuthController = require('../controllers/googleAuth.controller');

router.post("/google-login", googleAuthController.googleLogin);

module.exports = router;
