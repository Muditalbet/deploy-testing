const express = require('express')
const router = express.Router()
const cors = require('cors');

const interestControler = require('../controller/interestController')
const Auth = require('../middleware/Auth')
const Verified = require('../middleware/Verified')

router.post('/addInterest', interestControler.addInterest)
router.get('/allInterest', [cors(), Auth, Verified],interestControler.allInterest)
router.post('/applyInterest', [cors(), Auth, Verified], interestControler.applyInterest)
router.get('/allAppliedInterest', [cors(), Auth, Verified], interestControler.allAppliedInterest)
module.exports = router