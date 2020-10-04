const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const designSchema = new Schema({
    typeDeg:{
        type:String,
        required:true
    },
    designImageUrl:{
        type:String,
        required:true
    },
    designImageName:{
        type:String,
        required:true
    },
    designImageRate:{
        type:String,
        required:true
    }
});
module.exports = mongoose.model('Design',designSchema);