const express = require("express")
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const server = http.listen(3001, () => {
    console.log('listening on port: ' + server.address().port)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
    // res.render('index.ejs')
})

var numUsers = 0

io.on('connection', (socket) => {
    var addedUser = false

    socket.on('signal', (data) => {
        console.log("incoming signal")
        socket.broadcast.emit('signal', {
            username: socket.username,
            message: data
        })
    })

    socket.on('adduser', (username) => {
        if (addedUser) return
        console.log("added user")
    
        socket.username = username
        ++numUsers
        addedUser = true


        socket.emit('login', { numUsers: numUsers })

        socket.broadcast.emit('joined', {
            username: socket.username,
            numUsers: numUsers
        })
    })

    socket.on('disconnect', () => {
        if (!addedUser) return
        console.log("user left")

        --numUsers
    
        socket.broadcast.emit('left', {
            username: socket.username,
            numUsers: numUsers
        })
    })

})