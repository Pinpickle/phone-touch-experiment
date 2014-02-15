
if (mode === "client") {
  
}

var windowWidth = 0, windowHeight = 0;
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

$(document).ready(function() {
  
  if (mode === "client") {
    var touchElement = $("#touch-element"), canvas = touchElement[0];
    
    var pointers = [];
  
    var resize = function() {
      var nw = $(window).width(), nh = $(window).height();
      if ((nw != windowWidth) || (nh != windowHeight)) {
        windowWidth = nw;
        windowHeight = nh;
        
        canvas.width = windowWidth;
        canvas.height = windowHeight;
        
        pointers = [];
        onUpdate();
      }
    };
    
    var onUpdate = function() {
      //$(".output").text(pointers.length);
      
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
          console.log(pointer.x * windowWidth, pointer.y * windowHeight);  
          ctx.stroke();
        }
      } 
      requestAnimFrame(draw);
    };
    
    var onPointerDown = function(e) {
      e = e.originalEvent;
      var pointer = pointers[e.pointerId] = {
        x: e.x / windowWidth,
        y: e.y / windowHeight
      } 
      //$("<div>", {class: "touch-indicator"}).css({left: e.x, top: e.y});;
      //pointer.appendTo(touchElement);
      
      onUpdate();
    };
    
    var onPointerMove = function(e) {
      e = e.originalEvent;
      var pointer = pointers[e.pointerId];
      
      if (pointer) {
        //pointer.css({left: e.x, top: e.y})
        pointer.x = e.x / windowWidth;
        pointer.y = e.y / windowHeight;
      }
      
      onUpdate();
    };
    
    var onPointerUp = function(e) {
      e = e.originalEvent;
      var pointer = pointers[e.pointerId];
      
      if (pointer) {
        //pointer.remove();
        delete pointers[e.pointerId];
      }
      onUpdate();
    };
    
    var socket = io.connect(host);
    
    touchElement.on('pointerdown', onPointerDown);
    touchElement.on('pointermove', onPointerMove);
    touchElement.on('pointerup', onPointerUp);
    
    resize();
    $(window).resize(resize);
    
    requestAnimFrame(draw);
    
    
  }
});