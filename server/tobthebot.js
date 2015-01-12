var http = require('http');
var connect = require('connect');

// Create server
var app = connect();
var static = require('serve-static');
app.use(static('../front'));
var server = http.createServer(app);

// Load socket.io
var io = require('socket.io').listen(server);

// Callback exemple
io.sockets.on('connection', function (socket) {
    console.log('A new client is connected');
});


server.listen(8080);