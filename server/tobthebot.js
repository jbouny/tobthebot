var http = require( 'http' );
var connect = require( 'connect' );

// Create server
var app = connect();
var static = require( 'serve-static' );
app.use( static( '../front' ) );
var server = http.createServer( app );

var io = require( 'socket.io' )( server );

// Callback exemple
io.sockets.on( 'connection', function ( socket ) {
    console.log( 'A client is connected' );
	
	socket.on( 'message', function ( message ) {
		console.log( 'client: ' + message.key + " " + message.active );
	} );
});

server.listen( 8080, function() {
	console.log( 'Server listening on port 8080' ) ;
} );