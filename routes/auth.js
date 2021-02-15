const express =  require('express')
const router = express.Router()
const cors = require('cors')
// const mongoose = require('mongoose')
// const User = mongoose.model("User")
// const nodemailer = require('nodemailer')
const userContorller = require('../controller/userController')
const Auth = require('../middleware/Auth')
const Verified = require('../middleware/Verified')

//test route
// router.get('/test', Auth, async (req,res)=>{
//     res.send("hello "+ req.user.firstName + " " + req.user.lastName)
// })


router.post('/register', cors(), userContorller.register)
router.get('/verify', userContorller.verify)
router.post('/login', cors(),userContorller.login)
router.post('/email/checking', cors(), userContorller.checkemail)
router.get('/aboutUser', [cors(), Auth], userContorller.aboutUser)
router.get('/aboutAnotherUser', [cors(), Auth, Verified], userContorller.aboutAnotherUser)
module.exports = router;