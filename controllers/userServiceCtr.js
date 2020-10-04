//controller funtion for user after logged in

const User= require('../models/userModel');
const Design = require('../models/designSelectionModel');
const ITEM_PER_PAGE = 12;

//after login, Display user page.
exports.getUserHome = (req,res)=>{
    const loggedUserName = req.session.firstname;
    res.render('userEjs/userHome',{
        pageTitle:'Home',
        path:'/userHome',
        loggedUserName:loggedUserName
    })
}
//Getting User Profile Page
exports.getUserProfile = (req,res)=>{
    req.session.isLoggedIn = true;
    const userid = req.session.userId;
    const loggedUserName = req.session.firstname;
    return User.findOne({_id:userid})
    .then(userData=>{
        res.render('userEjs/userProfile',{
            pageTitle:'Profile',
            path:'/userProfile',
            udata:userData,
            uAddress:userData.address,
            updateMessage:null,
            loggedUserName:loggedUserName

        })
    })
    .catch(err=>{console.log(err);})
};


//Get request for Update Profile Page
exports.getUpdateProfile = (req,res)=>{
    req.session.isLoggedIn = true;
    const loggedUserName = req.session.firstname;
    const userid = req.session.userId;
    return User.findOne({_id:userid})
    .then(userData=>{
        res.render('userEjs/userUpdateProfile',{
            pageTitle:'UpdateProfile',
            path:'/updateProfile',
            udata:userData,
            uAddress:userData.address,
            loggedUserName:loggedUserName
        })
    })
    .catch(err=>{console.log(err);})
};

//Post request for updating profile details
exports.postUpdateProfile = (req,res)=>{
        if(req.method=="POST")
        {
            const loggedUserName = req.session.firstname;
            const userid = req.session.userId;
            const UpdFirstname = req.body.UpdateFirstname;
            const UpdLastname = req.body.UpdateLastname;
            const UpdateDob = req.body.UpdateDob;
            const gender = req.body.gender;
            const UpdAddress = req.body.UpdateAddress;
            const UpdCity = req.body.UpdateCity;
            const UpdState = req.body.UpdateState;
            const UpdPincode = req.body.UpdatePincode;
            const UpdContact = req.body.UpdateContact;
            return User.updateOne({_id:userid},{firstName:UpdFirstname,lastName:UpdLastname,
                    dateOfBirth:UpdateDob,gender:gender,address:{area:UpdAddress,city:UpdCity,state:UpdState,
                        pincode:UpdPincode},contactNumber:UpdContact})
                        .then(updatedResult=>{
                            User.findOne({_id:userid}).then(data=>{
                                res.render('userEjs/userProfile',{
                                pageTitle:'UpdateProfile',
                                path:'/updateProfile',
                                udata:data,
                                uAddress:data.address,
                                updateMessage:'Your Profile is Updated',
                                loggedUserName:loggedUserName
                            });
                            }).catch(err2=>{
                                console.log(err2);
                            })
                        })
                        .catch(err1=>{console.log(err1);});
        }
}

/********************************see design page ***********************************************/
exports.getShowDesigns = (req,res)=>{
    const loggedUserName = req.session.firstname;
    const  name = req.session.username;
    page = +req.query.page || 1;
    let totalItems;                        //bsback
    Design.find().countDocuments().then(numProd =>{
        totalItems = numProd;
        return Design.find()
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);})
        .then(design => {
        res.render('designs/seeDesigns',{
            pageTitle:'Blouse',
            path:'/user/BlsBackDsgSel',
            user:name,
            loggedUserName:loggedUserName,
            getSelect : 'blouse',
            desg:design,
            currentPage : page,
            hasNextPage:ITEM_PER_PAGE * page < totalItems,
            hasPreviousPage : page> 1,
            nextPage : page+ 1,
            previousPage : page - 1,
            lastPage: Math.ceil(totalItems / ITEM_PER_PAGE)
                 });
          })
    .catch(err => {
       console.log(err);
    });
};


