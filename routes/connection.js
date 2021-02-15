const express = require('express')
const cors = require('cors')
const router = express.Router()

const connectionController = require('../controller/connectionController')
const Auth = require('../middleware/Auth')
const Verified = require('../middleware/Verified')

router.post('/addConnection', [cors(), Auth, Verified], connectionController.addConnection)
router.get('/getRequest', [cors(), Auth, Verified], connectionController.myRequest)
router.post('/requestDecision', [cors(), Auth, Verified], connectionController.acceptConnection)
router.get('/myFriends', [cors(), Auth, Verified], connectionController.myConnections)
router.get('/checkConnection', [cors(), Auth, Verified], connectionController.checkConnection)

module.exports = router