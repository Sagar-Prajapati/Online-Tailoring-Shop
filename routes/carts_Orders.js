const express = require('express');
const multer = require('multer');
const cart_Order = require('../controllers/carts_orderCtr');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

const todaysDate2 = new Date().toISOString();
temp1 = todaysDate2.toString().replace(/:|-/g,"_");

const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'userUploadedImages');
    },
    filename:(req,file,cb)=>{
        const userid = req.session.userId;
        cb(null,userid+'_'+temp1+'_'+file.originalname);
    }
});
const fileFilter = (req,file,cb)=>{
    if(
        file.mimetype ==='image/png' ||
        file.mimetype ==='image/jpg' ||
        file.mimetype ==='image/jpeg'
    ){
        cb(null,true);
    }else{
        cb(null,false);
    }
};
var userUpload = multer({storage:fileStorage,fileFilter:fileFilter});

//getting cart route
router.get('/user/cart',isAuth,cart_Order.getCart);


//route for adding blouse service to cart
router.post('/user/addToCartBlouse',isAuth,userUpload.fields([
    {name:'FileUpload1',maxCount:1},
    {name:'originalProductUpl',maxCount:1}
]),cart_Order.addToCartBlouse);

//route for Adding Pico/Fall service to cart
router.post('/user/addToCartPicoFall',isAuth,userUpload.single('originalProductUpl2'),cart_Order.addToCartPicoFall);

//route for Adding Stitch my Old service to cart
router.post('/user/addToCartOldClothStitch',isAuth,userUpload.single('originalProductUpl3'),cart_Order.addToCartOldClothStitch);


//Deleting from cart
router.post('/user/deleteFromCart',isAuth,cart_Order.deleteFromCart);

//ordering this cart items
router.post('/user/orderFromCart',isAuth,cart_Order.orderFromCart);


router.get('/user/orders',isAuth,cart_Order.getPlacedOrders);

module.exports = router;
