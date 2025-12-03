const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
const { authUser } = require('../middlewares/authUser.js');


router.post('/register',userController.userRegister);
router.post('/login',userController.userLogin);
router.get('/profile',authUser,userController.userProfile)
router.get('/logout',authUser,userController.userLogout)



module.exports= router;