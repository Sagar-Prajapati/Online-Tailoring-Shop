const adminlogin = require('../models/adminlogin');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const Design = require('../models/designSelectionModel');
const User = require('../models/userModel');
const deliUser = require('../models/delPersonModel');
const orders = require('../models/ordersModel');
const tailorModel = require('../models/tailorModel');


const ADMIN_LOGIN_EMAIL = 'sagar72029@gmail.com';


const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'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'
    }
}));

exports.getAdminLoginPage = (req,res)=>{
    res.render('adminPanel/getAdminLoginPage',{
        pageTitle:'Admin Login',
        path:'/admin/login',
        errorMessage:null,
        userMessage:null
    });
};


exports.postAdminLoginLink = (req,res)=>{
    const email = req.body.AdminEmail;
    if(email != ADMIN_LOGIN_EMAIL){
                return res.render('adminPanel/getAdminLoginPage',{
                pageTitle:'Admin Login',
                path:'/admin/login',
                errorMessage:'This is not Valid Admin Email',
                userMessage:null
        })}
    else{
        crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
            res.redirect('/');
        }
        const adminTokenCreated = buffer.toString('hex');
        const tokenExpiration =  Date.now() +3600000;
        const adminloginM = new adminlogin({
            adminEmail:email,
            resetToken:adminTokenCreated,
            resetTokenExpiration:tokenExpiration
        })
        return adminloginM.save()
        .then(()=>{
           // console.log(email);
            transporter.sendMail({
                to:email,
                from:'dungratailorproject@gmail.com',
                subject:'Admin Access Link',
    //Update this URL before uploading to server.
                html:`
                    <p> This is your Access Link</p>
                    <p> Click this <a href="https://dungratailor-mca.herokuapp.com/admin/accessLink/${adminTokenCreated}" >link</a>
                     to reset your password</p>
                `
            })
            .then(()=>{
                res.status(422).render('adminPanel/getAdminLoginPage',{
                    pageTitle:'Admin Login',
                    path:'/admin/login',
                    userMessage:'Check Your Mail Account for Admin Access link',
                    errorMessage:null
                })
            })
            })            
        .catch(err=>{console.log(err);});
    })
    }
};



exports.getAdminDashboard =(req,res)=>{
    const token = req.params.adminTokenCreated;
    adminlogin.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
    .then(userFound=>{
        req.session.isLoggedIn = true;
        req.session.adminEmailId = userFound.adminEmail;
        req.session.save(useremail=>{
                console.log(useremail);
                res.redirect('/admin/dashboard');
            });
       return adminlogin.deleteOne({resetToken:token});
        
    })
    .catch(err=>{
        console.log(err);
        res.redirect('/admin/login')
    });   
};

exports.AllocationMethod =(req,res,next)=>{
    orders.find({allocatedServiceMan:'NO'}).populate('customerID').then(aloc=>{
        if(!aloc){
            next();
        }else{
        for(var i=0;i<aloc.length;i++){
        const abc = aloc[i].customerID.address[0].city;
        const orderCustId = aloc[i].customerID._id;
        let allocatedPersonForOrder,allocatedTailorForOrder;
        deliUser.find({flag:'0'}).then(deli=>{
            if(!deli){
                allocatedPersonForOrder=null;
            }else{
            for(var i=0;i<deli.length;i++){
                const deCity = deli[i].addressOfPerson[0].city
                if(deCity === abc){
                  allocatedPersonForOrder = deli[i]._id
                  break;
                }
            }
            }}).then(()=>{
                tailorModel.find({flag:'0'}).then(shTa=>{
                    if(!shTa){
                        allocatedTailorForOrder = null;
                    }else{
                    for(var i=0;i<shTa.length;i++){
                        const taCity = shTa[i].addressOfTailor[0].city
                       if(taCity === abc){
                          allocatedTailorForOrder = shTa[i]._id;
                          break;
                        }}
                       }}).then(()=>{
                           const alocatedTailorForOrder2 = allocatedTailorForOrder;
                           const allocatedPersonForOrder2 = allocatedPersonForOrder; 
                           if(allocatedPersonForOrder2!=null && alocatedTailorForOrder2!=null){
                           // console.log(abc+"  _  "+allocatedPersonForOrder+"  _  "+allocatedTailorForOrder);
                            return orders.updateMany({customerID:orderCustId,allocatedServiceMan:'NO'},{tailorAllocated:allocatedTailorForOrder,
                                delPersonAllocated:allocatedPersonForOrder,allocatedServiceMan:'YES'})
                                .then(()=>{
                                    tailorModel.updateOne({_id:allocatedTailorForOrder},{flag:'1'}).then(()=>{
                                        deliUser.updateOne({_id:allocatedPersonForOrder},{flag:'1'}).then().catch(err=>{console.log(err);})
                                    }).catch(err=>{console.log(err);})
                                }).catch(err=>{console.log(err);})
                           }
                          /* else
                           {    
                            return orders.updateMany({customerID:orderCustId},{tailorAllocated:null,
                                delPersonAllocated:null,allocatedServiceMan:'NO'})
                                .then().catch(err=>{console.log(err);})
                           }*/
                       }).catch(err=>{console.log(err);})
            }).catch(err=>{console.log(err)});
        }//for loop end
     } }).catch(err=>{console.log(err);});
};  
        

exports.adminDashboard = (req,res,cb)=>{
    orders.find({orderStatus:'pending for approval'})
    .populate('customerID')
    .populate('orderedFrontDesign')
    .populate('orderedBackDesign')
    .populate('delPersonAllocated')
    .populate('tailorAllocated')
    .exec().then(result=>{
       // console.log(result);
        return res.render('adminPanel/admin_Dashboard',{
            pageTitle:'Admin Dashboard',
            path:'/admin/dashboard',
            getOrd:result.reverse()
        });    
    })
    .catch(err=>{console.log(err);})
};

exports.getOrdersUpdated=(req,res)=>{
    this.AllocationMethod();
    return res.redirect('/admin/dashboard');
}


exports.acceptReceivedOrders =(req,res)=>{
    const orderID = req.query.id;
    orders.updateOne({_id:orderID},{orderStatus:'pending Tailor Approval'}).then(()=>{
        return res.redirect('/admin/dashboard');
    }).catch(err=>{console.log(err);})   
};

exports.rejectReceivedOrders = (req,res)=>{
    const rejectID = req.query.idR;
    orders.updateOne({_id:rejectID},{orderStatus:'REJECTED'}).then(()=>{
        return res.redirect('/admin/dashboard');
    }).catch(err=>{console.log(err);}) 

    
    ////{rejection query for allocated orders is remeaning}
};

exports.getDesignUpload = (req,res)=>{
    Design.find()
    .then(design => {
        res.render('adminPanel/getUploadDesigns',{
            pageTitle:'Design Uploads',
            path:'/admin/getDesignUpload',
            desg : design
   });})
    .catch(err => {
       console.log(err);
    });
};

exports.postDesignUpload = (req,res)=>{
    if(req.method==='POST'){
        const typedsg = req.body.typedsg;
        const img=req.file;
        const imgname = req.body.imgname;
        const imgrate = req.body.imgrate;
        const imgurl = img.path;
        Design.findOne({designImageName:imgname})
        .then(newDsg=>{
            if(!newDsg){
                const design = new Design({
                    typeDeg:typedsg,                   
                    designImageName:imgname,
                    designImageUrl:imgurl,
                    designImageRate:imgrate
                });
                return design.save()
                .then(()=>{
                    res.redirect('/admin/getDesignUpload');
                }).catch(err=>{console.log(err);});        
            }
        }).catch(err=>{
            console.log(err);
        });
 }
};


exports.postDeleteDesign = (req,res)=>{
    const designToDelete = req.body.designToDelete;
    console.log(designToDelete);  
    return Design.deleteOne({_id:designToDelete}).then(()=>{
        res.redirect('/admin/getDesignUpload');
    }).catch(err=>{console.log(err);});
    
};

exports.adminCustomerProfile = (req,res)=>{
    User.find({}).then(showCustomers=>{
        return res.render('adminPanel/customerProfile',{
            pageTitle:'Customer Profile',
            path:'/admin/customerProfile',
            cProfile:showCustomers
        });     
    }).catch(err=>{console.log(err);});
};

exports.adminCustomerDetails = (req,res)=>{
    const cusId = req.query.id;
    console.log(cusId);
    User.findOne({_id:cusId}).then(showCustomer=>{
        return res.render('adminPanel/customerDetails',{
            pageTitle:'Customer Details',
            path:'/admin/customerDetails',
            cusProfile:showCustomer
        });     
    }).catch(err=>{console.log(err);});
};


//tailor controllers
exports.adminTailorDetails=(req,res)=>{
    return tailorModel.find({}).then(showTailors=>{
            res.render('adminPanel/tailorDetails',{
            pageTitle:'Tailors Profile',
            path:'/admin/tailorProfile',
           tailorProfileData:showTailors
        });     
    }).catch(err=>{console.log(err);});
};


exports.adminTailorAccept=(req,res)=>{
    const tailorId = req.query.id;
    tailorModel.updateOne({_id:tailorId},{tailorStatus:'Approved'})
    .then(()=>{
        res.redirect('/admin/tailorDetails');
    })
    .catch(err=>{console.log(err);})
};


exports.adminTailorReject=(req,res)=>{
    const tailorId = req.query.id;
    tailorModel.deleteOne({_id:tailorId})
    .then(()=>{
        res.redirect('/admin/tailorDetails');
    })
    .catch(err=>{console.log(err);})
};



//delivery person routes
exports.deliveryPersonDetails = (req,res)=>{

    deliUser.find()
    .then((fonundedData)=>{
        res.render('adminPanel/deliveryPersonProfile',{
        pageTitle:'Delivery Person Details',
        path:'/admin/deliveryPersonDetails',
        dProfile:fonundedData
    });})
    .catch(err=>{console.log(err);})
    
};

exports.addDelPerson = (req,res) =>{
    res.render('adminPanel/deliveryPersonAdd',{
        pageTitle:'Delivery Person Add',
        path:'/admin/deliveryPersonAdd',
        errorMessage:null,updateMessage:null
    });
};

exports.addingDelPerson = (req,res)=>{
    const firstNameD = req.body.firstname;
    const lastNameD = req.body.lastname;
    const dateOfBirthD = req.body.birthdate;
    const genderD = req.body.gender;
    const areaD = req.body.address;
    const cityD = req.body.city;
    const stateD = req.body.state;
    const pincodeD = req.body.pincode;
    const contactNumberD = req.body.contact;
    const emailIdD = req.body.email;
    const todaysDate = new Date();
    var dd = String(todaysDate.getDate()).padStart(2,'0');
    var mm= String(todaysDate.getMonth()+1).padStart(2,'0');
    var yyyy = String(todaysDate.getFullYear());
    const ToDayD = dd+'/'+mm+'/'+yyyy;

    deliUser.findOne({emailId:emailIdD}).then(foundUser=>{
        if(foundUser){
        return res.render('adminPanel/deliveryPersonAdd',{
        pageTitle:'Delivery Person Add',
        path:'/admin/deliveryPersonAdd',
        errorMessage:'This Person Already Added',
        updateMessage:null
        })}
        const delPerson = new deliUser({
            firstName:firstNameD,
            lastName:lastNameD,
            dateOfBirth:dateOfBirthD,
            gender:genderD,
            addressOfPerson:[{
                area:areaD,
                city:cityD,
                state:stateD,
                pincode:pincodeD
            }],
            contactNumber:contactNumberD,
            emailId:emailIdD,
            DateOfRegistration:ToDayD,
            flag:'0'
        });
        return delPerson.save()
        .then(()=>{
            return res.render('adminPanel/deliveryPersonAdd',{
                pageTitle:'Delivery Person Add',
                path:'/admin/deliveryPersonAdd',
                updateMessage:'Person Added',
                errorMessage:null    
        })})
        .catch(err=>{console.log(err);});
    })
    .catch(err=>{console.log(err);})
};

exports.deletingDelPerson = (req,res)=>{
    const idToDelete = req.query.id;
    return deliUser.deleteOne({_id:idToDelete})
    .then(()=>{res.redirect('/admin/deliveryPersonDetails');})
    .catch(err=>{console.log(err);})
    
};

exports.updDelPerson = (req,res)=>{
    const idToUpdate = req.query.id;
    return deliUser.findOne({_id:idToUpdate})
    .then((resData)=>{
        return res.render('adminPanel/deliveryPersonUpd',{
            pageTitle:'Delivery Person Update',
            path:'/admin/deliveryPersonUpd',
            resData:resData,
            updateMessage:null,
            errorMessage:null    
   
    })})
    .catch(err=>{console.log(err);})
};


exports.updatingDelPerson = (req,res)=>{
    const idToUpdateU = req.body.idToUpdate; 
    const firstNameU = req.body.firstname;
    const lastNameU = req.body.lastname;
    const dateOfBirthU = req.body.birthdate;
    const genderU = req.body.gender;
    const areaU = req.body.address;
    const cityU = req.body.city;
    const stateU = req.body.state;
    const pincodeU = req.body.pincode;
    const contactNumberU = req.body.contact;
    const emailIdU = req.body.email;
    return deliUser.updateOne({_id:idToUpdateU},{firstName:firstNameU,lastName:lastNameU,
        dateOfBirth:dateOfBirthU,gender:genderU,addressOfPerson:{area:areaU,city:cityU,state:stateU,
            pincode:pincodeU},contactNumber:contactNumberU,emailId:emailIdU})
            .then(()=>{
                deliUser.findOne({_id:idToUpdateU})
                .then(resData=>{
                    return res.render('adminPanel/deliveryPersonUpd',{
                        pageTitle:'Delivery Person Update',
                        path:'/admin/deliveryPersonUpd',
                        updateMessage:'Data Updated',
                        resData:resData,
                        errorMessage:null    
                })})
                .catch(err=>{console.log(err);})
                })
            .catch(err=>{console.log(err);})
};

exports.product_status=(req,res)=>{
    orders.find()
    .populate('customerID')
    .populate('orderedFrontDesign')
    .populate('orderedBackDesign')
    .populate('delPersonAllocated')
    .populate('tailorAllocated')
    .exec().then(result=>{
       // console.log(result);
        return res.render('adminPanel/admin_prodStatus',{
            pageTitle:'Product Status',
            path:'/admin/prodStatus',
            getOrd12:result.reverse()
        });    
    })
    .catch(err=>{console.log(err);});
}


exports.adminLogout=(req,res) =>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/admin/login');
    })
};