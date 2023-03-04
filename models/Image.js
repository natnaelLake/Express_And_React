const mongoose = require('mongoose')
const Image = mongoose.Schema({
    title:{
        type:String,
        required:[true,'Please Enter Title'],
    },
    description:{
        type:String,
        required:[true,'Please Enter Description'],
    },
    image:{
        data: Buffer,
        contentType: String,
    }
})
module.exports = mongoose.model('Image',Image)