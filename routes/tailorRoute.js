const express = require('express');

const tailorCont = require('../controllers/tailorCrt');
const adminemailAuthTailor = require('../middleware/adminmail-tailorAuth');
const router = express.Router();

router.get('/tailor/login',tailorCont.getTailorLogin);

router.get('/tailor/signup',tailorCont.getTailorSignup);

router.post('/tailor/postTailorSignup',adminemailAuthTailor,tailorCont.postTailorSignup);

router.post('/tailor/postTailorLogin',adminemailAuthTailor,tailorCont.postTailorLogin);

router.get('/tailor/tailorDashboard',adminemailAuthTailor,tailorCont.tailorDashboard);

router.get('/tailor/logout',tailorCont.getTailorLogout);

module.exports = router;