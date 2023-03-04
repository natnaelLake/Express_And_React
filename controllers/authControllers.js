const User = require('../models/User')
const Image = require('../models/Image')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const multer = require('multer')
const { set } = require('../app');
const express = require('express')
const app = express()
app.use(cookieParser())
const fs = require('fs')
const path = require('path')



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname)
        console.log('welcome to the multer')
    }
});
const upload = multer({ storage:storage})


const handleErrors = (err)=>{
    console.log(err.message,err.code)
    let errors = {email:'',password:'',fristName:'',lastName:'',phone:''};

    if (err.message === 'incorrect email'){
         errors.email = 'incorrect email'
    }
    if (err.message === 'incorrect password'){
        errors.password = 'incorrect password'
   }

    //duplicate email validation using mongodb
    if (err.code === 11000){
        errors.email = 'the email is already exists'
        return errors
    }


    // regestration validation using mongodb
    if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
            // console.log(erro)rs
        })
    }
    return errors
}
const maxAge = 3*24*60*60
const creatToken = (id)=>{
    return jwt.sign({id},'Bewuketu Lake',{
        expiresIn:maxAge
    })
}


module.exports.signup_get = (req,res)=>{
    res.render('signup')
}
module.exports.signup_post = async (req,res)=>{
    const {fristName,lastName,email,password,phone} = req.body
    try{
        const user = await User.create({
            fristName,
            lastName,
            email,
            password,
            phone
        })
        const token =  creatToken(user._id)
        console.log(token)
        res.cookie('createdToken',token,{httpOnly:true})
        res.status(201).json({user:user._id})
    }
    catch (err){
        let errors = handleErrors(err)
        // console.log(errors)
        res.status(400).json({errors})
    }
    // res.send('signup')
}
module.exports.login_get = (req,res)=>{
    res.render('login')
}
module.exports.login_post = async (req,res)=>{
    const {email,password} = req.body
    try{
        const auth = await User.login(email,password)
        console.log(auth)
        const token =  creatToken(auth._id)
        res.cookie('createdToken',token,{httpOnly:true})
        res.status(201).json({user:auth._id})
    }
    catch(err){
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
}
module.exports.gallery_get = (req,res)=>{
    res.json('welcome to the gallery page')
}
module.exports.cards_get = async (req,res,next)=>{
    const images = Image.find({},(err,image)=>{
        res.status(200).json({ImageData:image})
    })
}
module.exports.cards_post = upload.single('image'),async (req,res,next)=>{
    const {title,description} = req.body
    try{
        console.log(req.body.image)
        const images = await Image.create({
            title,
            description,
            image:{
                data: fs.readFileSync(path.join(__dirname + '/../public/images/' + req.body.image)),
                contentType: req.file.mimetype        
            }
        })
        res.status(201).json({image:images._id})
    }
    catch(err){
        console.log(err)
        res.status(400).json(err)
    }
    
}