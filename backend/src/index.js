const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

mongoose.connect(
    'mongodb+srv://Goweek:goweek123@cluster0-ocb4u.mongodb.net/test?retryWrites=true&w=majority', 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

app.use((req, res, next)=> {
    req.io = io
    return next()
})

app.use(cors())

app.use(express.json())
app.use(require('./controllers/routes'))

server.listen(3000, () => {
    console.log('Server started on port 3000')
})