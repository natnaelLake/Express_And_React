const {isEmail} = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const User = new mongoose.Schema({
    fristName:{
        type:String,
        required:[true,'you must enter your first name']
    },
    lastName:{
        type:String,
        required:[true,'you must enter your last name']
    },
    email:{
        type:String,
        required:[true,'you must enter your email'],
        lowercase:true,
        unique:true,
        validate:[isEmail,'please enter valid email']
    },
    password:{
        type:String,
        required:[true,'you must enter password'],
        minlength:[8,'the min character is 8']
    },
    phone:{
        type:Number,
        required:[true,'enter your phone number '],
        // maxlength:[10,'the number length is 10'],
        minlength:[10,'the number length is 10']
    }
})



// User.post('save',function (doc,next){
//     console.log('the saved and registered data is :',doc)
//     next()
// })


User.pre('save',async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

User.statics.login = async function (email,password){
    const userFound = await this.findOne({email});
    // console.log(userFound)
    if(userFound){
        const passFound = await bcrypt.compare(password,userFound.password)
        if(passFound){
            return userFound
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}


module.exports = mongoose.model('user',User)