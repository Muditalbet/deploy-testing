const mongoose = require('mongoose')

const UserInterestSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:'Please enter User Id',
        unique:true,
    },
    interest_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Interest',
        default:undefined
    }]
})

module.exports = mongoose.model("UserInterest", UserInterestSchema)