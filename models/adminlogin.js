const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const onlyForAdminLogin = new Schema({
    adminEmail:{
        type:String
    },
    resetToken:String,
    resetTokenExpiration:Date
});
module.exports = mongoose.model('OnlyAdminLogin',onlyForAdminLogin);