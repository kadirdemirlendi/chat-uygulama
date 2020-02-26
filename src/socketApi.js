const socketio = require('socket.io');

const io = socketio();

const socketApi = {
    io
};

io.on('connection', socket => {
    console.log('bir kullanıcı giriş yaptı');
    /**
     * Redis Adapter
     */
    const redisAdapter = require('socket.io-redis');
    io.adapter(redisAdapter({ 
        host: process.env.REDIS_URI,
        port: process.env.REDIS_PORT
    }));
});

module.exports = socketApi;