const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');

const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT,process.env.REDIS_URI,{ auth_pass : process.env.REDIS_PASS});
const RedisStore = require("connect-redis")(session);

const dotenv = require('dotenv');
dotenv.config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const chatRouter = require('./routes/chat');
const messagesRouter = require('./routes/messages');

const app = express();

//helpers
const db = require('./helpers/db')();

//middlewares
const isAuthanticated = require('./middleware/isAuthenticated');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// express-session
app.use(session({
    store: new RedisStore({ client : client, logErrors : true }),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 14 * 24 * 360000 }
}));

//passport.js
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/chat', isAuthanticated, chatRouter);
app.use('/messages', isAuthanticated, messagesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;