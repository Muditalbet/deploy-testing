const mongoose = require('mongoose')
const post = require('../model/post')
const UserPost = mongoose.model("UserPost")
const User = mongoose.model("User")
const Connection = mongoose.model("Connection")

exports.newPost = async (req, res) => {
    const { Content, Type, InterestRelatedToPost } = req.body
    UserPost.findOne({
        user_id: req.user
    }).then(response => {
        if (!response) {
            // console.log("running if not response")
            let Post = [{ Content, Type, InterestRelatedToPost }]
            const newUserPost = new UserPost({
                user_id: req.user,
                Post: Post
            })
            newUserPost.save()
                .then(done => res.json({ message: "Post uploaded" })).catch(err => console.log(err))
        }
        if (response) {
            // console.log("running if response")
            let Post = [{ Content, Type, InterestRelatedToPost }]
            UserPost.findOneAndUpdate(
                { user_id: req.user },
                { $push: { Post: Post } },
                null,
                (err, docs) => {
                    if (err) console.log(err)
                    else res.json({ message: "Post uploaded" })
                }
            )
        }
    }).catch(err => console.log(err))
}

exports.myPosts = async (req, res) => {
    UserPost.findOne({ user_id: req.user })
        .then(response => {
            if (!response) return res.status(401).json({ message: 'you haven\'t posted till now!!!' })
            UserPost.aggregate([
                {
                    $match: {
                        'user_id': req.user
                    }
                },
                { $unwind: "$Post" },
                { $sort: { "Post.PostedOn": -1 } },
                { $group: { _id: "$_id", user_id: { "$first": "$user_id" }, Post: { $push: "$Post" } } }
            ]).then(data => res.send(data[0])).catch(err => console.log(err))
        }).catch(err => console.log(err))
}

exports.userPost = async (req, res) => {
    const { u_name } = req.body
    User.findOne({
        userName: u_name
    }).then(response => {
        if (!response) return res.status(401).json({ error: 'Invalid User' })
        UserPost.aggregate([
            {
                $match: {
                    'user_id': response._id
                }
            },
            { $unwind: "$Post" },
            { $sort: { "Post.PostedOn": -1 } },
            { $group: { _id: "$_id", user_id: { "$first": "$user_id" }, Post: { $push: "$Post" } } }
        ]).then(data => res.send(data[0])).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

exports.feedMain = async (req, res) => {
    Connection.findOne({ user_id: req.user })
        .then(data => {
            let connection_ids = []
            // console.log(data)
            if(data === null) return res.json({message:'connect people to get feed'})
            data.connections.forEach(element => {
                connection_ids.push(element.connection_id)
            })
            connection_ids.push(req.user)
            post.find({
                user_id: { $in: connection_ids }
            }).then(response => {
                let Posts = []
                response.forEach(element => {
                    element.Post.forEach(postElement => {
                        Posts.push(postElement)
                    })
                })
                Posts.sort(function (a, b) { return (a.PostedOn - b.PostedOn) * -1 })
                console.log(Posts.length)
                if (Posts.length < 5) return res.json(Posts)
                else {
                    let PostsToBeSend = []
                    for (var i = 0; i < 5; i++) {
                        PostsToBeSend.push(Posts[i])
                    }
                    res.send(PostsToBeSend)
                }
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
}

exports.feedUpdate = async (req, res) => {
    const { ShowedPosts } = req.body
    Connection.findOne({ user_id: req.user })
        .then(data => {
            let connection_ids = []
            data.connections.forEach(element => {
                connection_ids.push(element.connection_id)
            })
            connection_ids.push(req.user)
            post.find({
                user_id: { $in: connection_ids }
            }).then(response=>{
                let Posts = []
                response.forEach(element => {
                    element.Post.forEach(postElement=>{
                        if(!ShowedPosts.includes(String(postElement._id))){
                            Posts.push(postElement)
                        }
                    })
                })
                Posts.sort(function (a, b) { return (a.PostedOn - b.PostedOn) * -1 })
                if(Posts.length < 5) return res.send(Posts)
                else{
                    let PostsToBeSend = []
                    for(var i = 0; i < 5; i++){
                        PostsToBeSend.push(Posts[i])
                    }
                    res.send(PostsToBeSend)
                }
            }).catch(err=>console.log(err))
        }).catch(err => console.log(err))
}