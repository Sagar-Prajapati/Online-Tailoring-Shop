const User = require('../models/userModel');
const Design = require('../models/designSelectionModel');
const Orders = require('../models/ordersModel');

const baseRate = parseInt(100);

exports.getCart=(req,res)=>{
    const userId2 = req.session.userId;
    const loggedUserName = req.session.firstname;
    User.findOne({_id:userId2}).populate('cart.frontDesign').populate('cart.backDesign').exec().then(r=>{
      const axt = r.cart;
      res.render('carts/cart',{
        pageTitle:'User Cart',
        path:'/user/cart',
        axt1:axt,
        loggedUserName:loggedUserName
          })
    }).catch(err=>{
      console.log(err);
    });
  };




exports.addToCartBlouse = (req,res)=>{
      const userid = req.session.userId;
      const frontSelectedDesignImage = req.body.frontSelectedDesignImageId;
      const backSelectedDesignImage = req.body.backSelectedDesignImageId;
      const mainService = 'Blouse';
      const subService = req.body.Measurement;  
      const loggedUserName = req.session.firstname;     //userfit || stdsize || sendtailor

      //getting image URL of originalProductUpl from User Uploads
          let fileUpload2 = req.files['originalProductUpl'].map(file=>file.path);
          let originalProductUpl1 = JSON.stringify(fileUpload2).toString();
          var temp1 = new String();
          temp1 = originalProductUpl1.toString().replace(/"/g,"");
          const strTemp = temp1.substring(1,temp1.length-1);
          var finalOriginalProductUpl = strTemp.replace(/\\/,'');
          
      if(subService=='userfit'){                   //userfit || stdsize || sendtailor
                let fileUpl3 = req.files['FileUpload1'].map(file=>file.path);    
                let userSareeUpload2 = JSON.stringify(fileUpl3).toString(); 
                var test23 = new String();
                test23 = userSareeUpload2.toString().replace(/"/g,"");
                const strTest23 = test23.substring(1,test23.length-1);
                var finalUserFitsRefrenceUploads=strTest23.replace(/\\/,'');          
                let frontDesignRate,backDesignRate,totalCalculatedRate;
                Design.findOne({_id:frontSelectedDesignImage}).then(fntDsg=>{
                  frontDesignRate=+fntDsg.designImageRate;
                }).catch(err=>{console.log(err);})
                
                Design.findOne({_id:backSelectedDesignImage}).then(bckDsg=>{
                  backDesignRate=+bckDsg.designImageRate;
                  totalCalculatedRate = +baseRate+frontDesignRate+backDesignRate;
                  User.updateOne({_id:userid},{$push:{cart:{serviceOpt:mainService,subServiceOpt:subService,
                  frontDesign:frontSelectedDesignImage,backDesign:backSelectedDesignImage,
                  totalRate:totalCalculatedRate,refrenceSareeImg:finalOriginalProductUpl,userFitsUpload:finalUserFitsRefrenceUploads}}})
                 .then(()=>{
                      res.render('ordersCreates/orderCreateMain',{
                      pageTitle:'New Order',
                      path:'/ordersSer',
                      updateMessage:'Your Request is Added to Cart for Blouse with Option of UserFits',
                      loggedUserName:loggedUserName
                  });
                }).catch(err=>{console.log(err);}) 
              }).catch(err1=>{console.log(err1);})
      }
      else if(subService=='stdsize'){
                const stndSize = req.body.stndSize;
                let frontDesignRate,backDesignRate,totalCalculatedRate;
                Design.findOne({_id:frontSelectedDesignImage}).then(fntDsg=>{
                  frontDesignRate=+fntDsg.designImageRate;
                }).catch(err=>{console.log(err);})  
                Design.findOne({_id:backSelectedDesignImage}).then(bckDsg=>{
                  backDesignRate=+bckDsg.designImageRate;
                  totalCalculatedRate = +baseRate+frontDesignRate+backDesignRate;   
                User.updateOne({_id:userid},{$push:{cart:{serviceOpt:mainService,subServiceOpt:subService,
                  totalRate:totalCalculatedRate,frontDesign:frontSelectedDesignImage,backDesign:backSelectedDesignImage,
                  refrenceSareeImg:finalOriginalProductUpl,stndSelSize:stndSize}}})
                          .then(()=>{
                            res.render('ordersCreates/orderCreateMain',{
                            pageTitle:'New Order',
                            path:'/ordersSer',
                            updateMessage:'Your Request is Added to Cart for Blouse with Option of Standard Size',
                            loggedUserName:loggedUserName
                          })})
                          .catch(err=>{console.log(err);})
                }).catch(err1=>{console.log(err1);})
      }
      else if(subService=='sendtailor'){
                const UserDate = req.body.userSelectedDate;
                const UserTimeSlot = req.body.userTimeSlot;
                let frontDesignRate,backDesignRate,totalCalculatedRate;
                Design.findOne({_id:frontSelectedDesignImage}).then(fntDsg=>{
                  frontDesignRate=+fntDsg.designImageRate;
                }).catch(err=>{console.log(err);})
                Design.findOne({_id:backSelectedDesignImage}).then(bckDsg=>{
                  backDesignRate=+bckDsg.designImageRate;
                  totalCalculatedRate = +baseRate+frontDesignRate+backDesignRate;
                User.updateOne({_id:userid},{$push:{cart:{serviceOpt:mainService,subServiceOpt:subService,
                  totalRate:totalCalculatedRate,frontDesign:frontSelectedDesignImage,backDesign:backSelectedDesignImage,
                  refrenceSareeImg:finalOriginalProductUpl,userTime:{selDate:UserDate,selTime:UserTimeSlot}}}})
                          .then(()=>{
                            res.render('ordersCreates/orderCreateMain',{
                            pageTitle:'New Order',
                            path:'/ordersSer',
                            updateMessage:'Your Request is Added to Cart for Blouse with Option of Sending Tailor Home',
                            loggedUserName:loggedUserName
                          })}).catch(err=>{console.log(err);});
                }).catch(err=>{console.log(err);})
      }
      else{
        res.redirect('/blouseOrder');
      }
};



exports.addToCartPicoFall = (req,res)=>{
                const userid = req.session.userId;
                const loggedUserName = req.session.firstname;
                const mainService = 'Pico/Fall';
                const originalProductUpl2 = req.file;
                const originalProductUpl2Url = originalProductUpl2.path;
                const picoSelection = req.body.SelPico;
                const fallSelection = req.body.SelFall;
                const picoRate = 25;
                const fallRate = 35;
                let totalPicoFallRate=0,picoSelection1,fallSelection1;
                if(picoSelection=="true" && fallSelection=="true"){
                  picoSelection1 = "Yes";
                  fallSelection1="Yes";
                  totalPicoFallRate = +picoRate+fallRate;
                }
                else if(picoSelection=="true" && fallSelection=="false")
                {
                    picoSelection1 = "Yes";
                    fallSelection1="No";
                    totalPicoFallRate = +picoRate;
                }
                else if(picoSelection=="false" && fallSelection=="true"){
                  picoSelection1 = "No";
                  fallSelection1="Yes";
                  totalPicoFallRate = +fallRate;
                }
                else{
                  picoSelection1 = "No";
                  fallSelection1="No";
                  totalPicoFallRate = 0;
                }
                User.updateOne({_id:userid},{$push:{cart:{serviceOpt:mainService,picoSelected:picoSelection1,fallSelected:fallSelection1,
                  totalRate:totalPicoFallRate,refrenceSareeImg:originalProductUpl2Url}}})
                  .then(()=>{
                      res.render('ordersCreates/orderCreateMain',{
                      pageTitle:'New Order',
                      path:'/ordersSer',
                      updateMessage:'Your Request is Added to Cart for Pico/Fall',
                      loggedUserName:loggedUserName
                  })})
                  .catch(err=>{console.log(err);})
};

exports.addToCartOldClothStitch = (req,res) =>{      
      const userid = req.session.userId;
      const mainService = 'Stitch Old Cloth';
      const originalProductUpl3 = req.file;
      const originalProductUpl3Url = originalProductUpl3.path;
      const convertClothOption = req.body.convertCloth;
      let totalConvertClothRate
      if(convertClothOption == 'Cusion Covers')
      {
        totalConvertClothRate = +150;
      }
      else if(convertClothOption == 'Curtains')
      {
        totalConvertClothRate = +100;
      } 
      else
      {
        totalConvertClothRate = 0;
      }
      User.updateOne({_id:userid},{$push:{cart:{serviceOpt:mainService,convertClothOption:convertClothOption,
        totalRate:totalConvertClothRate,refrenceSareeImg:originalProductUpl3Url}}})
        .then(()=>{
            res.render('ordersCreates/orderCreateMain',{
            pageTitle:'New Order',
            path:'/ordersSer',
            updateMessage:'Your Request is Added to Cart for Stitching your Old CLoth',
            loggedUserName:loggedUserName
        })})
        .catch(err=>{console.log(err);})
};


exports.deleteFromCart = (req,res)=>{
      const userid = req.session.userId;
      const itemId = req.body.ItemToDelete;
      User.updateOne({_id:userid},{$pull:{cart:{_id:itemId}}}).then(()=>{
        return res.redirect('/user/cart');
      }).catch(err=>{console.log(err);})
      
};


exports.orderFromCart = (req,res)=>{
      const userid = req.session.userId;
      const itemId = req.body.ItemToOrder;
      User.findOne({_id:userid})
      .then(result=>{       
        for(let re of result.cart){
            if(re._id==itemId)
            {
              if(re.serviceOpt=="Blouse"){
                const customerID = userid;
            const todaysDate = new Date();
            var dd = String(todaysDate.getDate()).padStart(2,'0');
            var mm= String(todaysDate.getMonth()+1).padStart(2,'0');
            var yyyy = String(todaysDate.getFullYear());
            var timing = String(todaysDate.toLocaleTimeString());
            const OrderToDay = dd+'/'+mm+'/'+yyyy+'_@_'+ timing;
                if(re.subServiceOpt=="userfit"){
                  const serviceOpt = re.serviceOpt;
                  const subServiceOpt = re.subServiceOpt;
                  const frontDesign = re.frontDesign;
                  const backDesign = re.backDesign;
                  const orderTotalRate = re.totalRate;
                  const refrenceSareeImg = re.refrenceSareeImg;
                  const userFitsUpload = re.userFitsUpload;
                  const orderR = new Orders({
                    customerID:customerID,
                    orderDate:OrderToDay,
                    orderService:serviceOpt,
                      subServiceOpt:subServiceOpt,
                      orderedFrontDesign:frontDesign,
                      orderedBackDesign:backDesign,
                      refrenceSareeImg:refrenceSareeImg,
                      userFitsUpload:userFitsUpload,
                    orderTotalRate:orderTotalRate,
                    tailorAllocated:null,
                    delPersonAllocated:null,
                    orderStatus:'pending for approval',
                    allocatedServiceMan:'NO'
                  });
                    orderR.save()
                    .then(()=>{
                      User.updateOne({_id:userid},{$pull:{cart:{_id:itemId}}}).then(()=>{
                        return res.redirect('/user/cart');
                      }).catch(err=>{console.log(err);})
                    })
                    .catch(err=>{console.log(err);});

                }
                else if(re.subServiceOpt=="stdsize"){
                  const serviceOpt = re.serviceOpt;
                  const subServiceOpt = re.subServiceOpt;
                  const frontDesign = re.frontDesign;
                  const backDesign = re.backDesign;
                  const orderTotalRate = re.totalRate;
                  const refrenceSareeImg = re.refrenceSareeImg;
                  const stndSelSize = re.stndSelSize;
                  const orderR = new Orders({
                    customerID:customerID,
                    orderDate:OrderToDay,
                    orderService:serviceOpt,
                      subServiceOpt:subServiceOpt,
                      orderedFrontDesign:frontDesign,
                      orderedBackDesign:backDesign,
                      refrenceSareeImg:refrenceSareeImg,
                      stndSelSize:stndSelSize,
                    orderTotalRate:orderTotalRate,
                    tailorAllocated:null,
                    delPersonAllocated:null,
                    orderStatus:'pending for approval',
                    allocatedServiceMan:'NO'
                   });
                    orderR.save()
                    .then(()=>{
                      User.updateOne({_id:userid},{$pull:{cart:{_id:itemId}}}).then(()=>{
                        return res.redirect('/user/cart');
                      }).catch(err=>{console.log(err);})
                    })
                    .catch(err=>{console.log(err);});

                }
                else if(re.subServiceOpt=="sendtailor"){
                  const serviceOpt = re.serviceOpt;
                  const subServiceOpt = re.subServiceOpt;
                  const frontDesign = re.frontDesign;
                  const backDesign = re.backDesign;
                  const orderTotalRate = re.totalRate;
                  const refrenceSareeImg = re.refrenceSareeImg;
                  //const userTime,
                  const selDate = re.userTime.selDate;
                  const selTime = re.userTime.selTime;
                  const orderR = new Orders({
                    customerID:customerID,
                    orderDate:OrderToDay,
                    orderService:serviceOpt,
                      subServiceOpt:subServiceOpt,
                      orderedFrontDesign:frontDesign,
                      orderedBackDesign:backDesign,
                      refrenceSareeImg:refrenceSareeImg,
                      userTime:{
                        selDate:selDate,
                        selTime:selTime
                      },
                    orderTotalRate:orderTotalRate,
                    tailorAllocated:null,
                    delPersonAllocated:null,
                    orderStatus:'pending for approval',
                    allocatedServiceMan:'NO'
                  });
                    orderR.save()
                    .then(()=>{
                      User.updateOne({_id:userid},{$pull:{cart:{_id:itemId}}}).then(()=>{
                        return res.redirect('/user/cart');
                      }).catch(err=>{console.log(err);})
                    })
                    .catch(err=>{console.log(err);});
                }
              }
              else if(re.serviceOpt=="Pico/Fall"){
                const customerID = userid;
                const todaysDate = new Date();
                var dd = String(todaysDate.getDate()).padStart(2,'0');
                var mm= String(todaysDate.getMonth()+1).padStart(2,'0');
                var yyyy = String(todaysDate.getFullYear());
                var timing = String(todaysDate.toLocaleTimeString());
                const OrderToDay = dd+'/'+mm+'/'+yyyy+'_@_'+ timing;
                const orderService = re.serviceOpt;
                const picoSelected = re.picoSelected;
                const fallSelected = re.fallSelected;
                const orderTotalRate = re.totalRate;
                const refrenceSareeImg = re.refrenceSareeImg;
                const orderR = new Orders({
                  customerID:customerID,
                  orderDate:OrderToDay,
                  orderService:orderService,
                    picoSelected:picoSelected,
                    fallSelected:fallSelected,
                    refrenceSareeImg:refrenceSareeImg,
                  orderTotalRate:orderTotalRate,
                  tailorAllocated:null,
                  delPersonAllocated:null,
                  orderStatus:'pending for approval',
                  allocatedServiceMan:'NO'
                });
                orderR.save()
                .then(()=>{
                  User.updateOne({_id:userid},{$pull:{cart:{_id:itemId}}}).then(()=>{
                    return res.redirect('/user/cart');
                  }).catch(err=>{console.log(err);})
                })
                .catch(err=>{console.log(err);});
              }  
              else if(re.serviceOpt=="Stitch Old Cloth"){
                const customerID = userid;
                const todaysDate = new Date();
                var dd = String(todaysDate.getDate()).padStart(2,'0');
                var mm= String(todaysDate.getMonth()+1).padStart(2,'0');
                var yyyy = String(todaysDate.getFullYear());
                var timing = String(todaysDate.toLocaleTimeString());
                const OrderToDay = dd+'/'+mm+'/'+yyyy+'_@_'+ timing;
                const convertClothOption =re.convertClothOption;
                const orderTotalRate = re.totalRate;
                const refrenceSareeImg = re.refrenceSareeImg;
                serviceOpt = re.serviceOpt;
                  const orderR = new Orders({
                  customerID:customerID,
                  orderDate:OrderToDay,
                  orderService:serviceOpt,
                    refrenceSareeImg:refrenceSareeImg,
                    convertClothOption:convertClothOption,
                  orderTotalRate:orderTotalRate,
                  tailorAllocated:null,
                  delPersonAllocated:null,
                  orderStatus:'pending for approval',
                  allocatedServiceMan:'NO'
                });
                orderR.save()
                .then(()=>{
                  User.updateOne({_id:userid},{$pull:{cart:{_id:itemId}}}).then(()=>{
                    return res.redirect('/user/cart');
                  }).catch(err=>{console.log(err);})
                })
                .catch(err=>{console.log(err);});                  
              }
            }
        } 
      }).catch(err=>{console.log(err);});
}



exports.getPlacedOrders = (req,res)=>{
    const custId = req.session.userId;
    const loggedUserName = req.session.firstname;
    Orders.find({customerID:custId}).populate('customerID')
    .populate('orderUploads[0].frontDesign')
    .populate('orderUploads[0].backDesign')
    .exec().then(showOrders=>{
      res.render('carts/ordersPlaced',{
        pageTitle:'User Placed Orders',
        path:'/user/orders',
        displayOrders:showOrders,
        loggedUserName:loggedUserName
          })
    })
    .catch(err=>{console.log(err);})
};