const express = require('express')
const cors = require("cors")
const router = express.Router()

const PostController = require('../controller/postController')
const Auth = require('../middleware/Auth')
const Verified = require('../middleware/Verified')

router.post("/addPost", [cors(), Auth, Verified], PostController.newPost)
router.get("/myPost", [cors(), Auth, Verified], PostController.myPosts)
router.get("/userPost", [cors(), Auth, Verified], PostController.userPost)
router.get("/feedMain", [cors(), Auth, Verified], PostController.feedMain)
router.get("/feedUpdate", [cors(), Auth, Verified], PostController.feedUpdate)
module.exports = router