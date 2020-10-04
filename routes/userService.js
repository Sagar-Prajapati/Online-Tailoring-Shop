//routes after user logged in the application
const express = require('express');

const userSerCont = require('../controllers/userServiceCtr');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/getUserHome',isAuth,userSerCont.getUserHome);

router.get('/userProfile',isAuth,userSerCont.getUserProfile);

router.get('/updateProfile',isAuth,userSerCont.getUpdateProfile);

router.post('/postUpdateProfile',isAuth,userSerCont.postUpdateProfile);


/************************************************************** 
for user options routes
************************************************************** */
router.get('/showDesigns',isAuth,userSerCont.getShowDesigns);



module.exports = router;


