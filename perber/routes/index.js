/* 
* @Author: hanjiyun
* @Date:   2013-11-03 04:47:51
* @Email:  jiyun@han.im
* @Last modified by:   hanjiyun
* @Last Modified time: 2013-12-17 17:30:13
*/


/*
* Module dependencies
*/

var passport = require('passport'),
    utils = require('../utils');

/**
 * Expose routes
 */

module.exports = Routes;

/**
 * Defines routes for application
 *
 * @param {Express} app `Express` instance.
 * @api public
 */

function Routes (app) {
    var config = app.get('config');
    var client = app.get('redisClient');
  
/*
* Homepage
*/

app.get('/', function(req, res, next) {
    // if(!req.isAuthenticated()){
        // client.hmset(
        //     'users:' + req.user.provider + ":" + req.user.username,
        //     req.user
        // );
        // res.redirect('/rooms');

        // utils.getPublicRoomsInfo(client, function(rooms) {
        //     res.render('room_list', { rooms: rooms });
        // });

        // res.redirect('/04a496')
        res.render('room');
    // } else{
        // res.render('index');
    // }
});

/*
* Authentication routes
*/

if(config.auth.twitter.consumerkey.length) {
    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', 
        passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/'
        })
    );
}

if(config.auth.facebook.clientid.length) {
    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback', 
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/'
        })
    );
}

if(config.auth.douban.clientid.length) {
    app.get('/auth/douban', passport.authenticate('douban'));

    app.get('/auth/douban/callback', 
        passport.authenticate('douban', {
            successRedirect: '/',
            failureRedirect: '/'
        })
    );
}

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

/*
* Rooms list
*/

app.get('/rooms', utils.restrict, function(req, res) {
    utils.getPublicRoomsInfo(client, function(rooms) {
        res.render('room_list', { rooms: rooms });
    });
});

/*
* Create a rooom
*/

app.post('/create', utils.restrict, function(req, res) {
    utils.validRoomName(req, res, function(roomKey) {
        utils.roomExists(req, res, client, function() {
            utils.createRoom(req, res, client);
        });
    });
});

/*
* Join a room
*/

app.get('/:id', utils.restrict, function(req, res) {
    // utils.getRoomInfo(req, res, client, function(room) {
        // utils.getUsersInRoom(req, res, client, room, function(users) {
            // utils.getPublicRoomsInfo(client, function(rooms) {
                utils.getUserStatus(req.user, client, function(status) {
                    utils.enterRoom(req, res, room, users, rooms, status);
                });
            // });
        // });
    // });
});

}