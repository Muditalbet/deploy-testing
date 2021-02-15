const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = async (req, res, next)=>{
    User.findOne({_id:req.user})
    .then(response=>{
        if(!response) return res.json({error:"token is invalid"})

        if(!response.isVerified) return res.json({error1:"Email is not Verified"})
        if(response.isVerified){
            // console.log("email is verified")
            next()
        }
    }).catch(err=>console.log(err))
}