const Design = require('../models/designSelectionModel');
const User = require('../models/userModel');
const ITEM_PER_PAGE = 12;

exports.getOrderService = (req,res) =>{
    loggedUserName= req.session.firstname;
    res.render('ordersCreates/orderCreateMain',{
        pageTitle:'New Order',
        path:'/ordersSer',
        updateMessage:null,
        loggedUserName:loggedUserName
    });
}

//Requesting Service
exports.postrequestedService = (req,res)=>{
    const SelService = req.body.Service;
    if(SelService == "SelBlouse"){
        res.redirect('/blouseOrder');
    }
    else if(SelService == "SelFallPico"){
        res.redirect('/picoFallOrder');
    }
    else if(SelService == "SelOld"){
        res.redirect('/stitchOldCloth');
    }
    else{
        res.redirect('/ordersSer')
    }    
}


//GET request for 3 different services

exports.getBlouseOrder = (req,res)=>{
    const loggedUserName = req.session.firstname;
    res.render('ordersCreates/blouseOrder',{
        pageTitle:'Blouse Order',
        path:'/blouseOrder',
        frontSelectedDesign:'-',
        backSelectedDesign:'-',
        frontSelectedDesignId:'-',
        backSelectedDesignId:'-',
        loggedUserName:loggedUserName
    });
    
}

exports.getPicoFallOrder = (req,res)=>{
    const loggedUserName = req.session.firstname;
    res.render('ordersCreates/picoFallOrder',{
        pageTitle:'Pico Fall Order',
        path:'/blouseOrder',
        loggedUserName:loggedUserName
    });
    
}
exports.getOldClothOrder = (req,res)=>{
    const loggedUserName = req.session.firstname;
    res.render('ordersCreates/stitchOldCloth',{
        pageTitle:'Stitch Old Cloth',
        path:'/blouseOrder',
        loggedUserName:loggedUserName
    });
    
}

//function for selection of Front Design Page
exports.getFrontDesign = (req,res)=>{
        const frontSelectedDesignId1 = req.query.frontSelectedDesignId;
        const backSelectedDesignId1 = req.query.backSelectedDesignId;
        const frontSelectedDesign1 = req.query.frontSelectedDesign;
        const backSelectedDesign1 = req.query.backSelectedDesign;



       // console.log(frontSelectedDesign1 + ","+ backSelectedDesign1 + " , "+frontSelectedDesignId1+","+backSelectedDesignId1);


        const loggedUserName = req.session.firstname;     
        page = +req.query.page || 1;
        let totalItems;                        //bsfront
        Design.find({typeDeg:"bsfront"}).countDocuments().then(numProd =>{
        totalItems = numProd;
        return Design.find({typeDeg:"bsfront"})
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);})
        .then(design => {
        res.render('ordersCreates/selectFrontDesign',{
            pageTitle:'Blouse Front Design',
            path:'/blouseOrder/selFrontDesign',
            desg:design,
            loggedUserName:loggedUserName,
            currentPage : page,
            hasNextPage:ITEM_PER_PAGE * page < totalItems,
            hasPreviousPage : page> 1,
            nextPage : page+ 1,
            previousPage : page - 1,
            lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
            frontSelectedDesignId:frontSelectedDesignId1,
            backSelectedDesignId:backSelectedDesignId1,
            frontSelectedDesign:frontSelectedDesign1,
            backSelectedDesign:backSelectedDesign1
                 });
          })
    .catch(err => {
       console.log(err);
    });
};


//function for selection of Front Design Image
exports.postSelectFrontDesign = (req,res)=>{
    const backSelectedDesignId3 = req.body.backSelectedDesignId;
    const backSelectedDesign3 = req.body.backSelectedDesign;
   // console.log(backSelectedDesign3+","+backSelectedDesignId3);
    const DesignIdfrompage = req.body.productId;
    const loggedUserName = req.session.firstname;
    return Design.findOne({_id:DesignIdfrompage})
    .then(result=>{
        res.render('ordersCreates/blouseOrder',{
            pageTitle:'Blouse Order',
            path:'/blouseOrder',
            loggedUserName:loggedUserName,
            frontSelectedDesign:result.designImageUrl,
            backSelectedDesign:backSelectedDesign3,
            frontSelectedDesignId:result._id,
            backSelectedDesignId:backSelectedDesignId3
        });
    })
    .catch(err=>{console.log(err);})
    
}


//function for selection of Back Design Page
exports.getBackDesign = (req,res)=>{
    const loggedUserName = req.session.firstname;
    const frontSelectedDesignId2 = req.query.frontSelectedDesignId;
    const backSelectedDesignId2 = req.query.backSelectedDesignId;
    const frontSelectedDesign2 = req.query.frontSelectedDesign;
    const backSelectedDesign2 = req.query.backSelectedDesign;

   // console.log(frontSelectedDesign2 + ","+ backSelectedDesign2 + " , "+frontSelectedDesignId2+","+backSelectedDesignId2);

    page = +req.query.page || 1;
    let totalItems;                        //bsback
    Design.find({typeDeg:"bsback"}).countDocuments().then(numProd =>{
        totalItems = numProd;
        return Design.find({typeDeg:"bsback"})
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);})
        .then(design => {
        res.render('ordersCreates/selectBackDesign',{
            pageTitle:'Blouse Back Design',
            path:'/blouseOrder/selBackDesign',
            desg:design,
            loggedUserName:loggedUserName,
            currentPage : page,
            hasNextPage:ITEM_PER_PAGE * page < totalItems,
            hasPreviousPage : page> 1,
            nextPage : page+ 1,
            previousPage : page - 1,
            lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
            frontSelectedDesignId:frontSelectedDesignId2,
            backSelectedDesignId:backSelectedDesignId2,
            frontSelectedDesign:frontSelectedDesign2,
            backSelectedDesign:backSelectedDesign2
                 });
          })
    .catch(err => {
       console.log(err);
    });
};



//function for selection of Back Design Image
exports.postSelectBackDesign = (req,res)=>{
    const loggedUserName = req.session.firstname;
    const frontSelectedDesignId4 = req.body.frontSelectedDesignId;
    const frontSelectedDesign4 = req.body.frontSelectedDesign;
    //console.log(frontSelectedDesignId4+","+frontSelectedDesign4);
    const DesignIdfrompage2 = req.body.productId;
    return Design.findOne({_id:DesignIdfrompage2})
    .then(result1=>{
        res.render('ordersCreates/blouseOrder',{
            pageTitle:'Blouse Order',
            path:'/blouseOrder',
            frontSelectedDesignId:frontSelectedDesignId4,
            backSelectedDesignId:result1._id,
            frontSelectedDesign:frontSelectedDesign4,
            backSelectedDesign:result1.designImageUrl,
            loggedUserName:loggedUserName
            });
    })
    .catch(err=>{console.log(err);})
}




