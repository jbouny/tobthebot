$( function() {
	var socket = io.connect('http://localhost:8080');

	var timeouts = { 37:null, 38:null, 39:null, 40:null } ;

	var LEFT = 37,
		UP = 38,
		RIGHT = 39,
		DOWN = 40 ;
		
	var getDisableCallback = function getDisableCallback( key ) {
		return function() {
			socket.emit( 'message', { key: key, active: false } ) ;
			clearTimeout( timeouts[key] );
			timeouts[key] = null ;
		} ;
	}

	$( document ).keydown( function( event ) {
		var key = event.which;
		if( key >= LEFT && key <= DOWN ) {
			var hasTimeout = ( timeouts[key] !== null ) ;
			if( hasTimeout ) {
				clearTimeout( timeouts[key] );
			}
			else {
				socket.emit( 'message', { key: key, active: true } ) ;
			}
			timeouts[key] = setTimeout( getDisableCallback( key ), 1000 ) ;
		}
	});

	$(document).keyup(function( event ){
		var key = event.which;
		if( key >= LEFT && key <= DOWN ) {
			getDisableCallback( key )() ;
		}
	});	
}) ;