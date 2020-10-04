const express = require('express');
const authUserConroller = require('../controllers/authUserCtr');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const adminemailAuth = require('../middleware/adminemail-auth');

//route for getting index page
router.get('/',authUserConroller.getIndex);
//route for getting signup page
router.get('/getSignup',authUserConroller.getSignup);
//route for getting login page
router.get('/getLogin',authUserConroller.getLogin);



//route for registraion of user form signup page
router.post('/postSignup',adminemailAuth,authUserConroller.postSignup);
//route for login of user form login page
router.post('/userHome',authUserConroller.postLogin);

//route for logout for user
router.get('/getLogout',isAuth,authUserConroller.getLogout);

router.get('/getForgotPassword',authUserConroller.getForgotPassword);

router.post('/postForgotPassword',authUserConroller.postForgotPassword);


router.get('/newPassword/:tokenCreated',authUserConroller.getNewPassword);

router.post('/updatePassword',authUserConroller.postUpdatePassword);


module.exports = router;