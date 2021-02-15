const mongoose = require('mongoose')

const connectionSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    connections:[{
        connection_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        connected:{type:Boolean, required:true, default:false}
    }]
})
module.exports = mongoose.model("Connection", connectionSchema)