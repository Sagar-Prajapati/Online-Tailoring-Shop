const express = require('express');
const isAdminAuth = require('../middleware/isAdmin-auth');

const adminPanelController = require('../controllers/adminPanelCtr');

const router = express.Router();

const multer = require('multer');

router.get('/admin/login',adminPanelController.getAdminLoginPage);

router.post('/adminLoginLink',adminPanelController.postAdminLoginLink);

router.get('/admin/accessLink/:adminTokenCreated',adminPanelController.getAdminDashboard);

router.get('/admin/dashboard',isAdminAuth,adminPanelController.adminDashboard);
router.get('/admin/getOrdersUpdated',isAdminAuth,adminPanelController.getOrdersUpdated);

router.get('/admin/acceptOrders',isAdminAuth,adminPanelController.acceptReceivedOrders);

router.get('/admin/rejectOrders',isAdminAuth,adminPanelController.rejectReceivedOrders);

router.get('/admin/getDesignUpload',isAdminAuth,adminPanelController.getDesignUpload);

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'dsgImg');
    },
    filename: (req, file, cb) => {
      cb(null,file.originalname);
    }
  });
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
var upload = multer({ storage: fileStorage, fileFilter: fileFilter });


router.post('/admin/postAddDesign',upload.single('img'),adminPanelController.postDesignUpload);
router.post('/admin/postDeleteDesign',adminPanelController.postDeleteDesign);


//Customer Routes
router.get('/admin/customerProfile',isAdminAuth,adminPanelController.adminCustomerProfile);
router.get('/admin/customerDetails',isAdminAuth,adminPanelController.adminCustomerDetails);

//Tailor Routes
router.get('/admin/tailorDetails',isAdminAuth,adminPanelController.adminTailorDetails);
router.get('/admin/tailorAccept',isAdminAuth,adminPanelController.adminTailorAccept);
router.get('/admin/tailorReject',isAdminAuth,adminPanelController.adminTailorReject);

//Delivery Person Route
router.get('/admin/deliveryPersonDetails',isAdminAuth,adminPanelController.deliveryPersonDetails);
router.get('/admin/addDelPerson',isAdminAuth,adminPanelController.addDelPerson);
router.post('/admin/addingDelPerson',adminPanelController.addingDelPerson);
router.get('/admin/delPerDelete',isAdminAuth,adminPanelController.deletingDelPerson);
router.get('/admin/updPerDelete',isAdminAuth,adminPanelController.updDelPerson);
router.post('/admin/updatingPerDetails',adminPanelController.updatingDelPerson);


router.get('/admin/product_status',isAdminAuth,adminPanelController.product_status);

//Admin Logout Route
router.get('/getAdminLogout',isAdminAuth,adminPanelController.adminLogout);



module.exports = router;