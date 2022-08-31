const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 5000;
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peer = ExpressPeerServer(server, {
	debug: true,
});

app.use('/peerjs', peer);
app.set('view engine', 'ejs');

// calling the public folder
app.use(express.static('public'));

// handling get request
app.get('/', (req, res) => {
	res.send(uuidv4());
});
app.get('/:room', (req, res) => {
	res.render('index', { RoomId: req.params.room });
});

io.on('connection', (socket) => {
	socket.on('newUser', (id, room) => {
		socket.join(room);
		socket.to(room).broadcast.emit('userJoined', id);
		socket.on('disconnect', () => {
			socket.to(room).broadcast.emit('userDisconnect', id);
		});
	});
});

server.listen(port, () => {
	console.log('Listening to the port :: ', port);
});
