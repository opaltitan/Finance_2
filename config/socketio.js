/**
 * Created by Justin on 7/6/2016.
 */
var config = require('./config'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    dl = require('delivery'),
    fs = require('fs'),
    excelData = require('excel-data');

module.exports = function(server, io, mongoStore){
    // Using the session cookies, verify that the user is authenticated
    io.use(function(socket, next){
        cookieParser(config.sessionSecret)(socket.request, {}, function(err){
            var sessionId = socket.request.signedCookies['connect.sid'];

            mongoStore.get(sessionId, function(err, session){
                socket.request.session = session;

                next(null, true);

                /*
                passport.initialize()(socket.request, {}, function(){
                    passport.session()(socket.request, {}, function(){
                        if(socket.request.user){
                            next(null, true);
                        } else {
                            next(new Error('User is not authenticated'), false);
                        }
                    });
                });
                */
            });
        });
    });

    io.sockets.on('connection', function(socket){

        socket.on('connection', function(){
            console.log('connection');
        });

        socket.on('stock_add', function(data){
            io.emit('stock_add', data);
        });

        socket.on('disconnect', function(){
            console.log('disconnected');
        });

    });

};