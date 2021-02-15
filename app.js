const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const port = 8000;

require('dotenv').config()

require('./model/user')
require('./model/interest')
require('./model/UserInterest')
require('./model/post')
require('./model/Requests')
require('./model/connections')

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex:true
})

mongoose.connection.on('connected', ()=>{
    console.log('Connected to Mongodb.')
})

mongoose.connection.on('error', (err)=>{
    console.log('Connetion error: ', err)
})

app.use(express.json())
app.use("/user", cors(),require('./routes/auth'))
app.use("/interest", cors(), require('./routes/Interest'))
app.use("/connection", cors(), require('./routes/connection'))
app.use("/posts", cors(), require('./routes/post'))


// app.get("/test", cors(), (req,res)=>{
//     res.send("hello mudit this is just an test")
// })

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))