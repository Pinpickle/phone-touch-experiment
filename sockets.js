var async = require('async');

exports.init = function(io) {
  io.of('/client').on("connection", function(socket) {
    console.log("Connection!");
    socket.on("pointers", function(data) {
      socket.set("pointer", data);
    });
  });
  
  io.of('/view').on("connection", function(socket) {
    console.log("View Connection!");
  });
  var pointers = [];
  var updatePointers = function() {
    pointers = [];
    async.map(io.of('/client').clients(), function(socket, callback) {
      socket.get("pointer", function(err, p) {
        if (err) {
          callback(err);
          return;
        }
        for (var i in p) {
          p[i].from = socket.id;
        }
        pointers = pointers.concat(p);
        callback(null, null);
      });
    }, function(err) {
      if (err) {
        console.error(err);
        return;
      }
    });
    
    io.of('/view').emit('pointers', pointers);
  }
  
  setInterval(updatePointers, 50);
}