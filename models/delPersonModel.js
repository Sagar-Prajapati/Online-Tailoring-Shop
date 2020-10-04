const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliveryPerson_Profile = new Schema({
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
    addressOfPerson:[{
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
    DateOfRegistration:{
        type:String,
        required:true
    },
    flag:{
        type:String
    }
});

module.exports = mongoose.model('DeliveryPerson_Profile',DeliveryPerson_Profile);