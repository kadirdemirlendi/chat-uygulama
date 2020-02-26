const cookieParser = require('cookie-parser');
const passportSocketIO = require('passport.socketio');
const session = require('express-session');

const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT,process.env.REDIS_URI,{ auth_pass : process.env.REDIS_PASS});
const RedisStore = require("connect-redis")(session);

function onAuthorizeSuccess(data, accept){
    console.log('successful connection to socket.io');
  
    // The accept-callback still allows us to decide whether to
    // accept the connection or not.
    accept(null, true);
  }
  
  function onAuthorizeFail(data, message, error, accept){
    if(error)
      throw new Error(message);
    console.log('failed connection to socket.io:', message);
  
    // We use this callback to log all of our failed connections.
    accept(null, false);
  }

module.exports = passportSocketIO.authorize({
    cookieParser,
    key: 'connect.sid',
    secret: process.env.SESSION_SECRET_KEY,
    store: new RedisStore({ client : client, logErrors : true }),
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
});