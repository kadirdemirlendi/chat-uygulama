const socketio = require('socket.io');
const socketAuthorization = require('../middleware/socketAuthorization');
const io = socketio();

const socketApi = {
    io
};

//lib
const Users = require('./lib/Users');

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
    Users.upsert(socket.id,socket.request.user);
});

module.exports = socketApi;