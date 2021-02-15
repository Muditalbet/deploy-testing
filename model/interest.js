const mongoose = require('mongoose')

const interestSchema = new mongoose.Schema({
    title:{
        type:String,
        required:'Enter the Interest name',
        unique:true
    }
})
module.exports = mongoose.model("Interest", interestSchema)