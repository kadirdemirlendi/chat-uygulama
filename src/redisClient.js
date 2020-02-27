const redis = require('redis');

const getClient = () => {
    return redis.createClient({
        host: process.env.REDIS_URI,
        post: process.env.REDIS_PORT,
    });
}

module.exports.getClient = getClient;