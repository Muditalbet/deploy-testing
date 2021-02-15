const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const uniqid = require('uniqid')
const jwt = require('jsonwebtoken')
const User = mongoose.model("User")
const mail = require('./mailController')
const { response } = require('express')
//const { findOneAndUpdate } = require('../model/user')

exports.register = async(req, res)=>{
    const { firstName, lastName, email, userName, password, confirmPassword } = req.body
    if( !firstName|| !lastName|| !email|| !userName|| !password|| !confirmPassword ){
        return res.status(422).json({error:"Field is missing."})
    }

    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(emailRegexp.test(email)==false){
        return res.status(422).json({error:"Email format is wrong."})
    }
    
    const passRegexExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{3,}$/ ;
    if(passRegexExp.test(password)==false){
        return res.status(422).json({error:"Password format is wrong."})
    }

    if (/[^a-zA-Z]/.test(firstName)){
        return res.status(422).json({error:"Firstname should contain only alphabets."})
    }

    if (/[^a-zA-Z]/.test(lastName)){
        return res.status(422).json({error:"Lastname should contain only alphabets."})
    }

    if (/[^a-zA-Z]/.test(userName)){
        return res.status(422).json({error:"Username should contain only alphabets."})
    }

    if( confirmPassword != password ) return res.status(422).json({error:"Password does not match."})
    
    await User.findOne({
        email:{ $regex : new RegExp(email, "i") }
    }).then((savedEmail)=>{
        if(savedEmail) return res.status(422).json({error:"Email already exist"})
        User.findOne({userName:userName})
        .then((savedUserName)=>{
            if(savedUserName) return res.status(422).json({error:"User name is already taken"})

            bcrypt.hash(password, 12)
            .then((hashedPassword)=>{
                const token = uniqid()
                const newUser = new User({
                    firstName,
                    lastName,
                    userName,
                    email,
                    password:hashedPassword,
                    token
                })
                newUser.save()
                .then(newUser=>{
                    const token_signin = jwt.sign({_id:newUser._id}, process.env.SECRET)
                    res.json({
                        message:"Verification mail sent",
                        token_signin
                    })
                    mail.send(token, newUser.email)
                }).catch( err=>console.log(err))
            }).catch(err=> console.log(err))
        }).catch((err)=>console.log(err))
    }).catch((err)=> console.log(err) )
}
exports.verify = async(req, res)=>{
    await User.findOne({token:req.query.id})
    .then(data=>{
        // console.log("working")
        if(!data) return res.send("not found")
        if(Date.now() > data.AccountCreatedOn) res.send("time exceted")
        else{
            User.findOneAndUpdate(
                {_id:data._id},
                {
                    isVerified:true,
                    token:null,
                    AccountCreatedOn: data.AccountCreatedOn - 12*60*60*1000
                },
                null,
                (err, docs)=>{
                    if(err) console.log(err)
                    else res.send("verified")
                }
            )
        }
    }).catch(err=>console.log(err))
}
exports.login = async(req, res)=>{
    const {email, password} = req.body
    if( !email || !password ) return res.json({error:"field is missing"})

    await User.findOne({
        email:{ $regex : new RegExp(email, "i") }
    }).then((existUser)=>{
        if(!existUser) return res.json({error:'Email or password is incorrect'})

        else{
            // if(existUser.isVerified == false) return res.json({error:"email is not verified"})

            bcrypt.compare(password, existUser.password)
            .then((match)=>{
                if(!match) return  res.json({error:"Email or password is incorrect."})
                else{
                    const token = jwt.sign({_id:existUser._id}, process.env.SECRET)
                    return res.json({
                        message:"Signed in sucessfully",
                        token
                    })
                }
            }).catch(err=>console.log(err))
        }
    }).catch(err=>console.log(err))
}
exports.checkemail = async(req, res) =>{
    const { email } = req.body;
    await User.find({
        email:{ $regex : new RegExp(email, "i") }
    }).then(response=>{
        if(response.length) res.json({error:"email already exist."})
        else res.json({message:"email accepted"})
    }).catch(err=>console.log(err))
}
exports.aboutUser = async(req, res) =>{
    await User.findOne({
        _id: req.user
    },{
        lastName:1,
        firstName:1,
        userName:1,
        email:1,
        _id:0
    }).then(response=>{
        res.send(response)
    }).catch(err=>console.log(err))
}
exports.aboutAnotherUser = async (req, res) =>{
    const { userName } = req.query
    if( !userName ) return res.json({error:"Username invalid"})
    await User.findOne({
        userName:userName
    }, {
        lastName:1,
        firstName:1,
        userName:1,
        email:1,
        _id:0
    }).then(response=>{
        if(!response) return res.json({message:"User Does Not Exist"})
        if(response) return res.send(response)
    }).catch(err=>console.log(err))
}