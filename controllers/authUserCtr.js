const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Design = require('../models/designSelectionModel');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'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'
    }
}));

//displaying index page
exports.getIndex = (req,res)=>{
    if(!req.session.isLoggedIn){
    res.render('index',{
        pageTitle:'Dungra Tailor',
        path:'/'
    });
    }
    else{
        res.redirect('/getUserHome');
    }
};
//displaying signup page
exports.getSignup = (req,res)=>{
    res.render('userEjs/userSignup',{
        pageTitle:'Signup',
        path:'/getSignup',
        errorMessage:null
    });
};
//displaying login page
exports.getLogin = (req,res)=>{
    res.render('userEjs/userLogin',{
        pageTitle:'Login',
        path:'/getLogin',
        errorMessage:null
    });
}

exports.getForgotPassword = (req,res)=>{
    res.render('userEjs/getResetPage',{
        pageTitle:'Reset Password',
        path:'/getForgotPassword',
        errorMessage:null,
        userMessage:null
    });
};

exports.getNewPassword = (req,res)=>{
    const token = req.params.tokenCreated;
    User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
    .then(userP=>{
        res.render('userEjs/postResetPage',{
            pageTitle:'Reset Password',
            path:'/newPassword',
            userid : userP._id.toString(),
            userEmail : userP.emailId,
            passwordToken: token    
        
    }) 
    }).catch(err=>{console.log(err);});
}

exports.postForgotPassword = (req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
            return res.redirect('/getForgotPassword');
        }
        const tokenCreated = buffer.toString('hex');
        User.findOne({emailId:req.body.reset_email})
        .then(userReset=>{
            if(!userReset){
                return res.status(422).render('userEjs/getResetPage',{
                    pageTitle:'Reset Password',
                    path:'/getForgotPassword',
                    errorMessage:'This User Not Found',
                    userMessage:null
                })}
                userReset.resetToken = tokenCreated;
                userReset.resetTokenExpiration = Date.now() +3600000;
                return userReset.save();
        })
        .then(() =>{
            res.status(422).render('userEjs/getResetPage',{
                pageTitle:'Reset Password',
                path:'/getForgotPassword',
                userMessage:'Check Your Mail Account for reset password link',
                errorMessage:null
            })
            transporter.sendMail({
                to:req.body.reset_email,
                from:'dungratailorproject@gmail.com',
                subject:'Password Reset',
    //Update this URL before uploading to server.
                html:`
                    <p> You Requested for Password Reset</p>
                    <p> Click this <a href="https://dungratailor-mca.herokuapp.com/newPassword/${tokenCreated}" >link</a>
                     to reset your password</p>
                `
            })

        })
        .catch(errReset=>{console.log(errReset);});        
    })
};



exports.postUpdatePassword = (req,res)=>{
    const newPass = req.body.new_pass;
    const userid = req.body.userid;
    const passwordTokenUser = req.body.passwordToken;
    let resetUser;

    User.findOne({resetToken:passwordTokenUser,
        resetTokenExpiration:{$gt:Date.now()},
        _id:userid})
        .then(user=>{
            resetUser = user;
            return bcrypt.hash(newPass,12);
        })
        .then(hashedPassword2=>{
            resetUser.password = hashedPassword2;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result=>{
            res.redirect('/getLogin');
            return transporter.sendMail({
                to:result.emailId,
                from:'dungratailorproject@gmail.com',
                subject:'Password Update Succeeded',
                html:'<h1>'+result.firstName +',You have successful Updated your password</h1><br><h4>wellcome to Dungra Tailor'
            })
                 
        })
        .catch(err=>{console.log(err);})
}

//function for registration of user from signup page
exports.postSignup = (req,res)=>{
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
            User.findOne({emailId:email})
            .then(userDate=>{
                if(userDate){
                    return res.render('userEjs/userSignup',{
                        pageTitle:'Signup',
                        path:'/getSignup',
                        errorMessage:'This Email is Already Registered with Us.'
                    });
                }
                return bcrypt.hash(password,12)
                .then(hashedPassword=>{
                    const user = new User({
                        firstName:firstName,
                        lastName:lastName,
                        dateOfBirth:birthDate,
                        gender:gender,
                        address:[{
                            area:area,
                            city:city,
                            state:state,
                            pincode:pincode
                        }],
                        contactNumber:contact,
                        emailId:email,
                        password:hashedPassword,
                        DateOfRegistration:ToDay       
                    });
                    return user.save();
                }).then(()=>{
                    res.redirect('/getLogin');
                    return transporter.sendMail({
                        to:email,
                        from:'dungratailorproject@gmail.com',
                        subject:'Signup Succeeded',
                        html:'<h1>'+firstName +',You have successful signup with us</h1><br><h4>wellcome to Dungra Tailor'
                    })
                    
                }).catch(err=>{console.log(err);});
            })
            .catch(err=>{console.log(err);});
        }
};


//function for login of user from login page
exports.postLogin = (req,res,next)=>{
        if(req.method=='POST'){
            loginEmail = req.body.your_email;
            loginPassword = req.body.your_pass;
            if(loginEmail=="" && loginPassword=="")
            {
                return res.render('userEjs/userLogin',{
                    pageTitle:'Login',
                    path:'/getLogin',
                    errorMessage:'Please Enter UserName & Password'
                });
            }
            User.findOne({emailId:loginEmail})
            .then(userFound=>{
                if(!userFound){
                    return res.status(422).render('userEjs/userLogin',{
                        pageTitle:'Login',
                        path:'/getLogin',
                        errorMessage:'This User Not Found'
                    });
                }
                bcrypt.compare(loginPassword,userFound.password)
                .then(doMatch=>{
                    if(!doMatch){
                        return res.status(422).render('userEjs/userLogin',{
                            pageTitle:'Login',
                            path:'/getLogin',
                            errorMessage:'Password Does Not Match'
                        }); 
                    };
                    req.session.isLoggedIn = true;
                    req.session.userId = userFound._id;
                    req.session.firstname = userFound.firstName;
                    req.session.emailId = userFound.emailId;
                    return req.session.save(()=>{
                            res.redirect('/getUserHome');
                        });
                })
                .catch(err=>{console.log(err);})
            }).catch(err=>{console.log(err);})
        }
};

//function for User Logout
exports.getLogout = (req,res)=>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/');
    })
}


