const express = require('express');

const orderController = require('../controllers/createOrdersCtr');
const isAuth = require('../middleware/is-auth');
const router = express.Router();


router.get('/ordersSer',isAuth,orderController.getOrderService);


//router for selection of service
router.post('/requestedService',isAuth,orderController.postrequestedService);

//three service routes
router.get('/blouseOrder',isAuth,orderController.getBlouseOrder);
router.get('/picoFallOrder',isAuth,orderController.getPicoFallOrder);
router.get('/stitchOldCloth',isAuth,orderController.getOldClothOrder)

//getting front and back design page for blouse route
router.get('/blouseOrder/selFrontDesign',isAuth,orderController.getFrontDesign);
router.get('/blouseOrder/selBackDesign',isAuth,orderController.getBackDesign);


//selecting designs from front and back page routes
router.post('/blouseOrder/selectFront',isAuth,orderController.postSelectFrontDesign);
router.post('/blouseOrder/selectBack',isAuth,orderController.postSelectBackDesign);


module.exports = router;


