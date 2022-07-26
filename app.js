const express = require('express');

const http = require('http');
const app = express();
app.use(express.static('public'));
app.get('/',function(req,res){
    res.sendFile('index.html',{root: __dirname});
})

const hostname = '127.0.0.1';
const port = 8080;

const server = http.Server(app)

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});