module.exports = function(server) {
	const io = require('socket.io')(server);
	io.sockets.on('connection', onListeningSocket);

	function onListeningSocket(socket) {
		console.log('connected')
		const socketInt = setInterval(() => {
			socket.emit('metric', {usage: GLOBAL.usage, time: GLOBAL.exectime})
		}, 500);

	  socket.on('disconnect', function(){
	  	clearInterval(socketInt);
	  });
	}

	return io;
};