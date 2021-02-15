const mongoose = require('mongoose')
const User = mongoose.model("User")
const Request = mongoose.model("Request")
const Connection = mongoose.model("Connection")

exports.addConnection = async (req, res)=>{
    const { r_uname } = req.body
    await User.findOne({_id:req.user})
    .then(response=>{
        if(!response) return res.json({error:'Invalid user'})

        User.findOne({userName:r_uname})
        .then(correctRequest=>{
            if(!correctRequest) return res.json({error:"Request to invalid user."})
            Connection.findOne({user_id:response._id})
            .then(userConnection=>{
                if(!userConnection){
                    let request_id = [{connection_id:correctRequest._id}]
                    const newUserConnection = new Connection({
                        user_id:response._id,
                        connections:request_id
                    })
                    newUserConnection.save()
                    .then(done=>{
                        Request.findOne({user_id:correctRequest._id})
                        .then(RequestUser=>{
                            if(!RequestUser){
                                let requestList = [done.user_id]
                                const newRequest = new Request({
                                    user_id:correctRequest._id,
                                    request_ids:requestList
                                })
                                newRequest.save()
                                .then(end=>{
                                    return res.json({message:"request send sucessfully"})
                                }).catch(err=>console.log(err))
                            }
                            if(RequestUser){
                                let newRequest = [done.user_id]
                                Request.findOneAndUpdate(
                                    {user_id:correctRequest._id},
                                    {$addToSet:{request_ids:newRequest}},
                                    null,
                                    (err, docs)=>{
                                        if(err) return console.log(err)
                                        else res.json({message:"Request send sucessfully"})
                                    }
                                )
                            }
                        }).catch(err=>console.log(err))
                    }).catch(err=>console.log(err))
                }
                if(userConnection){
                    let request_id = [{connection_id:correctRequest._id}]
                    Connection.findOneAndUpdate(
                        {user_id:userConnection.user_id, "connections.connection_id":{$ne: correctRequest._id}},
                        {$push:{connections:request_id}},
                        null,
                        (err, docs)=>{
                            if(err) console.log(err)
                            else {
                                Request.findOne({user_id:correctRequest._id})
                                .then(RequestUser=>{
                                    if(!RequestUser){
                                        let requestList = [userConnection.user_id]
                                        const newRequest = new Request({
                                            user_id:correctRequest._id,
                                            request_ids:requestList
                                        })
                                        newRequest.save()
                                        .then(end=>{
                                            res.json({message:"request send sucessfully"})
                                        }).catch(err=>console.log(err))
                                    }
                                    if(RequestUser){
                                        let newRequest = [userConnection.user_id]
                                        Request.findOneAndUpdate(
                                            {user_id:correctRequest._id},
                                            {$addToSet:{request_ids:newRequest}},
                                            null,
                                            (err, docs)=>{
                                                if(err) return console.log(err)
                                                else res.json({message:"Request send sucessfully"})
                                            }
                                        )
                                    }
                                }).catch(err=>console.log(err))
                            }
                        }
                    )
                }
            }).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
}

exports.myRequest = async (req, res)=>{
    Request.findOne({user_id:req.user})
    .then(response=>{
        if(!response) return res.json({message:"you dont have any request"})
        User.find({
            _id:{ $in: response.request_ids}
        }).then(data=>{
            if(!data) return res.json({message:"you dont have any request"})
            let requestList = []
            data.forEach(element=>{
                requestList.push(element.firstName + " " + element.lastName)
            })
            res.json(requestList)
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
}

exports.acceptConnection = async (req, res)=>{ 
    const { u_name, accepted } = req.body
    Request.findOne({
        user_id:req.user
    }).then(response=>{
        if(!response) return res.status(401).json({error:"Bad Query"})

        User.findOne({
            userName:u_name
        }).then(validUser=>{
            if(!validUser) return res.status(401).json({error:"Wrong User Name"})

            const u_id = validUser._id
            Request.findOne({
                request_ids:u_id
            }).then(requestExist=>{
                if(!requestExist) return res.status(401).json({error:"User name is not correct"})

                else{
                    Request.findOneAndUpdate(
                        {user_id:response.user_id},
                        {$pull:{request_ids:u_id}},
                        null,
                        (err,docs)=>{
                            if(err) return console.log(err)
                            else{
                                if(!accepted){
                                    Connection.findOneAndUpdate(
                                        {user_id:u_id},
                                        {$pull:{connections:{connection_id:response.user_id}}},
                                        null,
                                        (err, docs)=>{
                                            if(err) return console.log(err)
                                            else res.json({message:"Friend request decline"})
                                        }
                                    )
                                }
                                if(accepted){
                                    Connection.findOneAndUpdate(
                                        {user_id:u_id, "connections.connection_id":response.user_id},
                                        {$set:{"connections.$.connected":true}},
                                        null,
                                        (err,docs) =>{
                                            if(err) return console.log(err)

                                            else{
                                                Connection.findOne({user_id:response.user_id})
                                                .then(finalData=>{
                                                    if(!finalData){
                                                        let request_id = [{connection_id:u_id, connected:true}]
                                                        const newUserConnection = new Connection({
                                                            user_id:response.user_id,
                                                            connections:request_id
                                                        })
                                                        newUserConnection.save()
                                                        .then(done=>{
                                                            res.json({message:"Friend request accepted"})
                                                        }).catch(err=>console.log(err))
                                                    }
                                                    if(finalData){
                                                        let request_id = [{connection_id:u_id, connected:true}]
                                                        Connection.findOneAndUpdate(
                                                            {user_id:response.user_id},
                                                            {$addToSet:{connections:request_id}},
                                                            null,
                                                            (err, docs)=>{
                                                                if(err) return console.log(err)
                                                                else return res.json({message:"Friend request accepted."})
                                                            }
                                                        )
                                                    }
                                                }).catch(err=>console.log(err))
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    )
                }
            }).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
        //Request.findOneAndUpdate
    }).catch(err=>console.log(err))
}

exports.myConnections = async (req, res)=>{
    Connection.findOne(
        {user_id:req.user, "connections.connected":true}
    ).then(data=>{
        if(!data) res.send({message:"no conections till now"})

        let u_ids = []
        // res.send(data.connections)
        data.connections.forEach(element=>{
            u_ids.push(element.connection_id)
        })
        User.find({
            _id:{$in:u_ids}
        }).then(response=>{
            let friendList = []
            response.forEach(element=>friendList.push(element.firstName + " " + element.lastName))
            res.send(friendList)
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
}
exports.checkConnection = async (req,res) =>{
    const { userName } = req.query
    await User.findOne({
        userName:userName
    }).then(response=>{
        Connection.findOne(
            {user_id:req.user, "connections.connected":true}
        ).then(data=>{
            if(!data) return res.json({notConnected:"Not connected"})
            let ids = []
            data.connections.forEach(element=>{
                ids.push(element.connection_id)
            })
            if(ids.includes(response._id)) return res.json({message:"Connected"})
            else return res.json({notConnected:"Not connected"})
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
}