const socketio = require('socket.io');
const socketAuthorization = require('../middleware/socketAuthorization');
const io = socketio();

const socketApi = {
    io
};

// socket authorization
io.use(socketAuthorization);

io.on('connection', socket => {
    console.log('bir kullanıcı '+socket.request.user.name+' ile giriş yaptı');
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