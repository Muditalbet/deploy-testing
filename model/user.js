const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:"First Name is require",
        trim:true
    },
    lastName:{
        type:String,
        require:"Last name is require",
        trim:true
    },
    userName:{
        type:String,
        unique:true,
        required:"User name is require",
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:"email is require",
        trim:true,
    },
    password:{
        type:String,
        require:"Password is require",
        trim:true,
    },
    isVerified: {
        type:Boolean,
        default:false
    },
    token:{
        type:String,
    },
    AccountCreatedOn:{
        type:Date,
        default: () => Date.now() + 12*60*60*1000,
    }
});

module.exports = mongoose.model("User", userSchema);