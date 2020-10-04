const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Orders_Model = new Schema({
   customerID:{
       type: Schema.Types.ObjectId,
       ref: 'Customer_Profile'
   },
   orderDate:{
       type:String,
       required:true
   },
   orderService:{
        type:String,
        required:true 
   },
    subServiceOpt:{
        type:String
    },
    orderedFrontDesign:{
        type: Schema.Types.ObjectId,
        ref: 'Design'
    },
    orderedBackDesign:{
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
    picoSelected:{
        type:String
    },
    fallSelected:{
        type:String
    },
    convertClothOption:{
        type:String
    },
    orderTotalRate:{
       type:Number,
       required:true
   },
   orderStatus:{
       type:String
   },
   tailorAllocated:{
        type: Schema.Types.ObjectId,
        ref: 'Tailor_Profile'
   },
   delPersonAllocated:{
        type: Schema.Types.ObjectId,
        ref: 'DeliveryPerson_Profile'
   },
   allocatedServiceMan:{
       type:String
   }

});
module.exports = mongoose.model('Orders',Orders_Model);