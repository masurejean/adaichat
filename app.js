const express = require('express');
const http = require('http');
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const hostname = '127.0.0.1';
const port = 8000;
let socketClients = [];



app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
})

// communication entre les clients et le serveur
// attention conneCTion
io.on('connection', (socket) => {
    console.dir(socket.id);
    socketClients.push({ id: socket.id })
    socket.emit("init", {
        message: "bienvenue nouveau client",
        id: socket.id,
        socketClients: socketClients
    })

    socket.on('initResponse', (initResponse) => {
        socketClients = initResponse.socketClients;
        console.dir(socketClients);
        // partager aux client deja connectes
        socket.broadcast.emit('newClient',{socketClients:socketClients})

    })

    if (socketClients.length > 0) {
        socket.on('disconnect', () => {
            // socket.id = client déconnecté

            for (let i = 0; i < socketClients.length; i++) {
                if (socketClients[i].id === socket.id) {
                    socketClients.splice(i, 1);
                }
            }
            console.log(socket.id);
            console.dir(socketClients);
            socket.broadcast.emit('clientDisconnect', {
                socketClients: socketClients
            })
        })

    }
})



server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
