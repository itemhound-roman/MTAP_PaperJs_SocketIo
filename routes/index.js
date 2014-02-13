
/*
 * GET home page.
 */

 var io = require('socket.io');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.testImage = function(req, res){
  res.render('test', {title: 'Test'});
}

exports.setApp = function(server){
  io = io.listen(server, {log: false});
  initializeSocket(io);
}

var initializeSocket = function(io_){
  io_.sockets.on('connection', function(socket){    

    socket.on('draw:progress', function (uid, start, coordinates) {    
      io.sockets.emit('draw:progress', uid, start, coordinates)
    });

    socket.on('draw:end', function (uid, data) {    
      io.sockets.emit('draw:end', uid, data)
    }); 
  });
}