

exports.init = function(io) {
  io.sockets.on("connection", function(socket) {
    console.log("Connection!");
  });
}