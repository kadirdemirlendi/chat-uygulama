const socketio = require('socket.io');
const socketAuthorization = require('../middleware/socketAuthorization');
const io = socketio();

const socketApi = {
    io
};

//lib
const Users = require('./lib/Users');
const Rooms = require('./lib/Rooms');
const Messages = require('./lib/Messages');

// socket authorization
io.use(socketAuthorization);

/**
     * Redis Adapter
     */
    const redisAdapter = require('socket.io-redis');
    io.adapter(redisAdapter({ 
        host: process.env.REDIS_URI,
        port: process.env.REDIS_PORT
    }));

io.on('connection', socket => {

    Rooms.list(rooms => {
        io.emit('roomList',rooms);
    });

    Users.upsert(socket.id,socket.request.user);

    Users.list(users => {
        io.emit('onlineList', users);
    });

    socket.on('newMessage', data =>{
        Messages.upsert({
            ...data,
            username : socket.request.user.name,
            usersurname : socket.request.user.surname,
        });
    });
    socket.on('newRoom', roomName => {
        Rooms.upsert(roomName);
        Rooms.list(rooms => {
            io.emit('roomList',rooms);
        });
    });

    socket.on('disconnect', () =>{
        Users.remove(socket.request.user.googleId);

        Users.list(users => {
            io.emit('onlineList', users);
        });
    });
});

module.exports = socketApi;