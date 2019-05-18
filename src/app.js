const bodyParser = require('body-parser')
const express = require('express')
const userRouter = require('./routers/user')

const app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({hello: 'world'})
})

app.use('/usuario', userRouter )

module.exports = app