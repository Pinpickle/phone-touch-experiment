var async = require('async');
//Format of received socket: x,y,id
//Format of sent socket: x,y,id,from
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
          if (p[i]) {
            p[i][p[i].length] = socket.id;
            pointers.push(p[i]);
          }
        }
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