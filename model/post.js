const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true,
        required:'Please enter a valid user id'
    },
    Post:[{
        Content:{type:String, required:true,},
        Type:{type:String, required:true, default:"Text"},
        Likes:{type:Number, required:true, default:0},
        InterestRelatedToPost:[{
            type:String, 
            required:true,
            default:undefined
        }],
        comment:[{
            message:{type:String, required:true},
            from_User:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"User"
            },
            Tagged_User:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            }],
            like:{type:Number, required:true, default:0}
        }],
        PostedOn:{
            type:Date,
            default: () => Date.now()
        }
    }]
})

module.exports = mongoose.model("UserPost", postSchema)