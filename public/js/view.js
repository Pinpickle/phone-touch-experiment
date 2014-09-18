$(document).ready(function() {
  var touchElement = $("#touch-element"), canvas = touchElement[0];
  var aspect = 1;
  var pointers = [];

  var resize = function() {
    var nw = $(window).width(), nh = $(window).height();
    if ((nw != windowWidth) || (nh != windowHeight)) {
      windowWidth = nw;
      windowHeight = nh;
      
      canvas.width = windowWidth;
      canvas.height = windowHeight;
		
			aspect = windowWidth / windowHeight;
			console.log(aspect > 1 ? aspect : 1);
    }
  };

  var draw = function() {
    var ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    
    ctx.strokeStyle = "#93cae3";
    ctx.lineWidth = "6";
    var i = 0;
    while (pointer = pointers[i++]) {
      
      if (pointer) {
        Math.seedrandom(pointer.from);
        pointer.colour = "hsla(" + Math.random().toFixed(3) * 300 + ",100%,50%," + pointer.opacity.toFixed(3) + ")";
        pointer.newx = pointer.x * windowWidth;
        pointer.newy = pointer.y * windowHeight;
        
        if (pointer.dead) {
          pointer.opacity -= 0.1;
          if (pointer.opacity <= 0) pointers.splice(--i, 1);
        } else {
          if (pointer.opacity < 1) pointer.opacity += 0.1;
        }
        
      }
    }
    
    var i = 0, n = 0;
    
    for (i = 0; i < pointers.length; i ++) {
      for (n = i; n < pointers.length; n ++) {
        
        var pointer1 = pointers[i], pointer2 = pointers[n];
        if (pointer1.from !== pointer2.from) {
					console.log((pointer1.x - pointer2.x) / (aspect > 1 ? aspect : 1), (pointer1.x - pointer2.x));
          var dis = Math.pow((pointer1.newx - pointer2.newx) / windowHeight, 2) + Math.pow((pointer1.y - pointer2.y), 2);
          if (dis < 0.08) {
            var grad = ctx.createLinearGradient(pointer1.newx, pointer1.newy, pointer2.newx, pointer2.newy);
            grad.addColorStop(0, pointer1.colour);
            grad.addColorStop(1, pointer2.colour);
            ctx.strokeStyle = grad;
            ctx.lineWidth = (1 - dis / 0.08) * 2;
            ctx.beginPath();
            ctx.moveTo(pointer1.newx, pointer1.newy);
            ctx.lineTo(pointer2.newx, pointer2.newy);
            ctx.stroke();
          }
        }
      }
    }
    
    for (var i in pointers) {
      var pointer = pointers[i];
      if (pointer) {
        ctx.fillStyle = pointer.colour;
        ctx.beginPath();
        ctx.arc(pointer.newx, pointer.newy, 12, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    
    
    requestAnimFrame(draw);
  };
  
  $(window).resize(resize);
  resize();
  
  var socket = io.connect(host + "/view");
  
  socket.on('pointers', function(data) {
    var newPointers = [], i = 0, n, pointer, pointerNew, added;
    while(pointerNew = data[i++]) {
      n = 0;
      added = false;
      while(pointer = pointers[n++]) {
        if ((pointer.id == pointerNew[2]) && (pointer.from == pointerNew[3])) {
          pointer.x = pointerNew[0];
          pointer.y = pointerNew[1];
          pointer.dead = false;
          added = true;
          
          pointers.splice(--n, 1);
          
          break;
        } 
      }
      
      if (!added) {
        pointer = {
          x: pointerNew[0],
          y: pointerNew[1],
          id: pointerNew[2],
          from: pointerNew[3],
          dead: false,
          opacity: 0
        }
      }
      
      newPointers.push(pointer);
    }
    
    i = 0;
    while (pointer = pointers[i++]) {
      pointer.dead = true;
      newPointers.push(pointer);
    }
    
    pointers = newPointers;
  });
  
  requestAnimFrame(draw);
});
