const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tailor_Profile = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    dateOfBirth:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    addressOfTailor:[{
        area:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        }
    }],
    contactNumber:{
        type:String,
        required:true
    },
    emailId:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    DateOfRegistration:{
        type:String,
        required:true
    },
    tailorStatus:{
        type:String,
        required:true
    },
    flag:{
        type:String
    },
    resetToken:String,
    resetTokenExpiration:Date
});

module.exports = mongoose.model('Tailor_Profile',Tailor_Profile);