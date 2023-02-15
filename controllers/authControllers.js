const User = require('../models/User')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const { set } = require('../app');
const express = require('express')
const app = express()
app.use(cookieParser())
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
    console.log(email,password)
    try{
        const auth = await User.login(email,password)
        res.status.json({user:auth._id})
        const token =  creatToken(auth._id)
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
        res.status(201).json({user:auth._id})
    }
    catch(err){
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
}