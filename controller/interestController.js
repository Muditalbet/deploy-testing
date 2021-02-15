const mongoose = require('mongoose')
const Interest = mongoose.model("Interest")
const User = mongoose.model("User")
const UserInterest = mongoose.model("UserInterest")

exports.addInterest = async (req,res)=>{
    const { title } = req.body
    if(!title) return res.status(401).json({errro:'please enter tittle name.'})

    await Interest.findOne({
        title:{$regex: new RegExp(title, "i")}
    }).then((savedInterest)=>{
        if(savedInterest) return res.status(401).json({error:'Interest already exist'})
        const newInterest = new Interest({
            title
        })
        newInterest.save()
        .then(newInterest=>{
            res.json({message:'added successfuly'})
        }).catch(err=>console.log(err))
    })
}
exports.allInterest = async(req,res) =>{
    Interest.find()
    .then(savedInterest=>{
        var interestNames = []
        savedInterest.forEach(element=>{
            interestNames.push(element.title)
        })
        res.send(interestNames)
    }).catch(err=>console.log(err))
}
exports.applyInterest = async(req,res)=>{
    const {titles} = req.body
    var regxTitles = []
    titles.forEach(element => {
        regxTitles.push( new RegExp(element, "i") )
    });

    await User.findOne({ _id:req.user })
    .then(savedUser=>{
        if(!savedUser) return res.json({error:'Email is incorrect'})

        Interest.find({
            title:{ $in: regxTitles}
        }).then(savedInterest=>{
            if(!savedInterest) return res.json({error:'Interests are not exists.'})
            
            var interest_Ids = []
            savedInterest.forEach(element=>{
                interest_Ids.push(element._id)
            })
            // console.log(interest_Ids)
            UserInterest.findOne({user_id:savedUser._id})
            .then(UserExist=>{
                if(!UserExist){
                    const newUserInterest = new UserInterest({
                        user_id:savedUser._id,
                        interest_id:interest_Ids
                    })
                    newUserInterest.save()
                    .then(savedUserInterest=>{
                        res.json({message:'Interest added to user.'})
                    }).catch(err=>console.log(err))
                }
                if(UserExist){
                    UserInterest.findOneAndUpdate(
                        {user_id:savedUser._id},
                        {interest_id:interest_Ids},
                        null,
                        (err, docs) =>{
                            if(err) console.log(err)
                            else res.json({message: "Intrest updated"})
                        }
                    )
                }
            }).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
}
exports.allAppliedInterest = async(req,res)=>{
    await UserInterest.findOne({user_id: req.user})
    .then(data=>{
        if(!data)  return res.json({message:"No Field is selected"})
        var interestNames = []
        Interest.find({
            _id:{$in:data.interest_id}
        }).then(userInterestName=>{
            userInterestName.forEach(element=>{
                interestNames.push(element.title)
            })
            res.send(interestNames)
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
}