const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = async (req, res, next)=>{
    const { authorization } = req.headers
    if(!authorization) return res.json({error:'token missing'})

    const token = authorization
    jwt.verify(token, process.env.SECRET, (err, payload)=>{
        if(err) return res.json({error: 'login first'})

        const { _id } = payload
        User.findById(_id)
        .then(userData=>{
            if(userData === null) return res.json({error:'login first'})
            req.user = userData._id
            next()
        }).catch(err=>console.log(err))
    })
}