$(document).ready(function() {
  var touchElement = $("#touch-element"), canvas = touchElement[0];
  
  var pointers = [];

  var resize = function() {
    var nw = $(window).width(), nh = $(window).height();
    if ((nw != windowWidth) || (nh != windowHeight)) {
      windowWidth = nw;
      windowHeight = nh;
      
      canvas.width = windowWidth;
      canvas.height = windowHeight;
    }
  };

  var draw = function() {
    var ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    ctx.strokeStyle = "#93cae3";
    ctx.lineWidth = "6";
    
    for (var i in pointers) {
      var pointer = pointers[i];
      if (pointer) {
        ctx.beginPath();
        ctx.arc(pointer.x * windowWidth, pointer.y * windowHeight, 20, 0, Math.PI * 2);
        ctx.stroke();
      }
    } 
    requestAnimFrame(draw);
  };
  
  $(window).resize(resize);
  resize();
  
  var socket = io.connect(host + "/view");
  
  socket.on('pointers', function(data) {
    pointers = data;
  });
  
  requestAnimFrame(draw);
});