const shortid = require('shortid');
const redisClient = require('../redisClient');

function Rooms() {
    this.client = redisClient.getClient();
}

module.exports = new Rooms();

Rooms.prototype.upsert = function (roomName){
    const newId = shortid.generate();
    this.client.hset(
        'rooms',
        '@Room:'+newId,
        JSON.stringify({
            id : '@Room:'+newId,
            roomName,
            when: Date.now()
        }),
        err => {
            if(err){
                console.error(err);
            }
        }
    )
};

Rooms.prototype.list = function(callback){
    let roomList = [];

    this.client.hgetall('rooms', function(err,rooms){
        if(err){
            console.error(err);
            return callback([]); //kullanıcı yok anlamına geliyor.
        }

        for(let room in rooms){
            roomList.push(JSON.parse(rooms[room]));
        }

        return callback(roomList);
    });
}