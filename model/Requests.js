const mongoose = require('mongoose')

const requestSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:"Please add valid User Id",
        unique:"User already exist"
    },
    request_ids:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:"Please add valid request User Id"
    }]
})

module.exports = mongoose.model("Request", requestSchema)