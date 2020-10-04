const bcrypt = require('bcryptjs');
const tailorModel = require('../models/tailorModel');
const orders = require('../models/ordersModel');

exports.getTailorLogin = (req,res)=>{
    res.render('tailorsEjs/tailorLogin',{
        pageTitle:'Tailor Login',
        path:'/getTailorLogin',
        errorMessage:null
    });
};

exports.getTailorSignup = (req,res)=>{
    res.render('tailorsEjs/tailorSignup',{
        pageTitle:'Tailor Signup',
        path:'/tailor/signup',
        errorMessage:null,
        updateMessage:null
    });
};

exports.postTailorLogin=(req,res)=>{
    if(req.method=='POST'){
        loginEmail = req.body.your_email;
        loginPassword = req.body.your_pass;
        if(loginEmail=="" && loginPassword=="")
        {
            return res.render('tailorsEjs/tailorLogin',{
                pageTitle:'Tailor Login',
                path:'tailor/login',
                errorMessage:'Please Enter UserName & Password'
            });
        }
        tailorModel.findOne({emailId:loginEmail})
        .then(tailorFound=>{
            if(!tailorFound){
                return res.status(422).render('tailorsEjs/tailorLogin',{
                    pageTitle:'Tailor Login',
                    path:'tailor/login',
                    errorMessage:'This User Not Found'
                });
            }else if(tailorFound.tailorStatus=='pending for approval'){
                return res.status(422).render('tailorsEjs/tailorLogin',{
                    pageTitle:'Tailor Login',
                    path:'tailor/login',
                    errorMessage:'Pending for Approval by Admin'
                }); 
            }else {
            bcrypt.compare(loginPassword,tailorFound.password)
            .then(doMatch=>{
                if(!doMatch){
                    return res.status(422).render('tailorsEjs/tailorLogin',{
                        pageTitle:'Tailor Login',
                        path:'tailor/login',
                        errorMessage:'Password Does Not Match'
                    }); 
                };
                req.session.isLoggedIn = true;
                req.session.userId = tailorFound._id;
                req.session.firstname = tailorFound.firstName;
                req.session.emailId = tailorFound.emailId;
                return req.session.save(useremail=>{
                        console.log(useremail);
                        res.redirect('/tailor/tailorDashboard');/////tailor dashboard
                    });
            })
            .catch(err=>{console.log(err);})
     } }).catch(err=>{console.log(err);})
    }
}

exports.postTailorSignup = (req,res)=>{
    if(req.method=='POST')
    {
        const firstName = req.body.firstname;
        const lastName = req.body.lastname;
        const birthDate = req.body.birthdate;
        const gender = req.body.gender;
        const area = req.body.address;
        const city = req.body.city;
        const state = req.body.state;
        const pincode = parseInt(req.body.pincode);
        const contact = parseInt(req.body.contact);
        const email = req.body.email;
        const password = req.body.pass;
        
        const todaysDate = new Date();
        var dd = String(todaysDate.getDate()).padStart(2,'0');
        var mm= String(todaysDate.getMonth()+1).padStart(2,'0');
        var yyyy = String(todaysDate.getFullYear());
        const ToDay = dd+'/'+mm+'/'+yyyy;
        tailorModel.findOne({emailId:email})
        .then(tailorDate=>{
            if(tailorDate){
                return res.render('tailorsEjs/tailorSignup',{
                    pageTitle:'Signup',
                    path:'/getSignup',
                    errorMessage:'This Email is Already Registered with Us.',
                    updateMessage:null

                });
            }
            return bcrypt.hash(password,12)
            .then(hashedPassword=>{
                const newTailor = new tailorModel({
                    firstName:firstName,
                    lastName:lastName,
                    dateOfBirth:birthDate,
                    gender:gender,
                    addressOfTailor:[{
                        area:area,
                        city:city,
                        state:state,
                        pincode:pincode
                    }],
                    contactNumber:contact,
                    emailId:email,
                    password:hashedPassword,
                    DateOfRegistration:ToDay,
                    tailorStatus:'pending for approval',
                    flag:'0'   
                });
                return newTailor.save()
                .then(()=>{
                    return res.render('tailorsEjs/tailorSignup',{
                        pageTitle:'Signup',
                        path:'/tailor/signup',
                        updateMessage:'You will able to Login after Admin Approval(you receive an Approval Email)',
                        errorMessage:null
                    });
                }).catch(err1=>{console.log(err1);})
            }).catch(err=>{console.log(err);});
        })
        .catch(err2=>{console.log(err2);});
    }
}



exports.tailorDashboard = (req,res)=>{
    const name= req.session.firstname;
    const tailorID = req.session.userId;
    orders.find({tailorAllocated:tailorID,orderStatus:'pending Tailor Approval'})
    .populate('orderedFrontDesign')
    .populate('orderedBackDesign')
    .populate('delPersonAllocated')
    .exec().then(result=>{
        return res.render('tailorsEjs/tailorDashboard',{
            pageTitle:'Tailor Dashboard',
            path:'/tailor/dashboard',
            getOrd:result.reverse(),
            loggedUserName:name
        });    
    })
    .catch(err=>{console.log(err);})
}

exports.getTailorLogout=(req,res)=>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/tailor/login');
    })   
}