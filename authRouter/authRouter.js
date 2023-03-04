const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const authControllers = require('../controllers/authControllers')



router.get('/login',authControllers.login_get)
router.post('/login',authControllers.login_post)
router.get('/signup',authControllers.signup_get)
router.post('/signup',authControllers.signup_post)
router.get('/gallery',authControllers.gallery_get)
router.post('/cards',authControllers.cards_post)
router.get('/gallary',authControllers.cards_get)

module.exports = router