const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customer_Profile = new Schema({
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
    address:[{
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
    cart:[{
        serviceOpt:{
            type:String,
        },
        subServiceOpt:{
            type:String
        },
        frontDesign:{
            type: Schema.Types.ObjectId,
            ref: 'Design'
        },
        backDesign:{
            type: Schema.Types.ObjectId,
            ref: 'Design'
        },
        refrenceSareeImg:{
            type:String
        },
        userFitsUpload:{
            type:String
        },
        stndSelSize:{
            type:String
        },
        userTime:{
            selDate:{
                type:Date
            },
            selTime:{
                type:String
            }
        },
        totalRate:{
            type:Number
        },
        picoSelected:{
            type:String
        },
        fallSelected:{
            type:String
        },
        convertClothOption:{
            type:String
        }
    }],
    password:{
        type:String,
        required:true
    },
    DateOfRegistration:{
        type:String,
        required:true
    },
    resetToken:String,
    resetTokenExpiration:Date
    
});

module.exports = mongoose.model('Customer_Profile',Customer_Profile);