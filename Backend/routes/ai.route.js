const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authUser } = require('../middlewares/authUser');

router.post('/generate', authUser, aiController.generateRecipe);
router.post('/save', authUser, aiController.saveGeneratedRecipe);

module.exports = router;
