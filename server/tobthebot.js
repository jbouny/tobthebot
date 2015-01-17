var http = require( 'http' );
var connect = require( 'connect' );
var os = require( 'os' );

// Create server
var app = connect();
var static = require( 'serve-static' );
app.use( static( '../front' ) );
var server = http.createServer( app );
var io = require( 'socket.io' )( server );

var motors = {};

if( os.platform() === 'linux' ) {
	var gpio = require( 'onoff' ).Gpio;
	
	var gpios = [];

	var nums = [17, 18, 22, 23]
	for( key in nums ) {
		console.log( 'Open GPIO ' + nums[key] ) ;
		gpios[nums[key]] = new gpio( nums[key], 'out' );
	}

	function Motor( gpioFront, gpioBack ) {
		this.gpioFront = gpioFront;
		this.gpioBack = gpioBack;
		
		this.stop = function stop() {
			gpios[this.gpioFront].writeSync( 0 ) ;
			gpios[this.gpioBack].writeSync( 0 ) ;
		}
		
		this.front = function front() {
			gpios[this.gpioFront].writeSync( 1 ) ;
			gpios[this.gpioBack].writeSync( 0 ) ;
		}
		
		this.back = function back() {
			gpios[this.gpioFront].writeSync( 0 ) ;
			gpios[this.gpioBack].writeSync( 1 ) ;
		}
	}
	
	motors = {
		left: new Motor( 17, 18 ),
		right: new Motor( 22, 23 )
	}	
}

var dir = {
	front: false,
	left: false,
	right: false,
	back: false
}

// Callback exemple
io.sockets.on( 'connection', function ( socket ) {
    console.log( 'A client is connected' );
	
	socket.on( 'message', function ( message ) {
		if( typeof message.key !== 'undefined' && typeof message.active !== 'undefined' ) {
			//console.log( 'command: ' + message.key + " " + message.active );
			
			if( os.platform() === 'linux' ) {
				switch( message.key )
				{
					case 37: // LEFT
						dir.left = message.active;
						break;
					case 38: // FRONT
						dir.front = message.active;
						break;
					case 39: // RIGHT
						dir.right = message.active;
						break;
					case 40: // BACK
						dir.back = message.active;
						break;
				}
				
				if( dir.front ) {
					if( dir.left ) {
						motors.right.front();
						motors.left.stop();
					}
					else if( dir.right ) {
						motors.right.stop();
						motors.left.front();
					}
					else {
						motors.right.front();
						motors.left.front();
					}
				}
				else if( dir.back ) {
					if( dir.left ) {
						motors.right.back();
						motors.left.stop();
					}
					else if( dir.right ) {
						motors.right.stop();
						motors.left.back();
					}
					else {
						motors.right.back();
						motors.left.back();
					}
				}
				else if( dir.left ) {
					motors.right.front();
					motors.left.back();
				}
				else if( dir.right ) {
					motors.right.back();
					motors.left.front();
				}
				else {
					motors.right.stop();
					motors.left.stop();
				}
			}
		}
	} );
});

server.listen( 8080, function() {
	console.log( 'Server listening on port 8080' );
} );
