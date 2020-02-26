const socketio = require('socket.io');

const io = socketio();

const socketApi = {
    io
};

io.on('connection', socket => {
    console.log('bir kullanıcı giriş yaptı');
});

module.exports = socketApi;