var mouseX = 0;
var mouseY = 0;
var scrollPosition = document.body.scrollTop;

var mouseDown = 0;
var clickTimeout;

function  getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

  return {
    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}

window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

canvas.addEventListener('mousemove',event => {
    // mouseX = event.clientX - canvas.getBoundingClientRect().left;
    // mouseY = event.clientY - canvas.getBoundingClientRect().top;
    // mouseX = event.offsetX;
    // mouseY = event.offsetY;
    var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y
    mouseX = (event.clientX - rect.left) * scaleX;
    mouseY = (event.clientY - rect.top) * scaleY;
    
})

canvas.addEventListener('mouseup', event => {
    if(mouseDown == 1){
        mouseDown = 0;
        entities[1].letGo();
    }
})

canvas.addEventListener('mousedown', event => {
    
    if(event.buttons == 1){ // left mouse click
        mouseDown = 1;
        // console.log(mouseX+" "+mouseY+ " entities x = "+entities[1].x + " y = "+entities[1].y + " offsetX = "+event.offsetX);
        
        const vertices = [                     // Bottom wall
                new Vector(mouseX, mouseY),
                new Vector(mouseX, mouseY+1),
        ];
        const edges = getEdges(vertices);
        const rectTemp = new Character();
        rectTemp.x = mouseX;//+50;
        rectTemp.y = mouseY;//-100;
        rectTemp.width = 1;
        rectTemp.height = 1;
        rectTemp.velX = 0;
        rectTemp.velY = 0;
        rectTemp.angle = 0;
        rectTemp.createVertices();
        // const collisionCheck = checkCollisionPoint(vertices,edges,entities[1]);
        // if(collisionCheck != -1){
            // console.log("interesting "+collisionCheck);
        // }
        if(checkCollision(entities[1],rectTemp) == true){
            entities[1].grab(mouseX,mouseY);
            // entities[1].createVertices();
            console.log("interesting "+entities[1].x+" mouseX = "+mouseX);
        }
    }
})

canvas.addEventListener('mouseleave', event => {
    if(mouseDown == 1){
        mouseDown = 0;
        entities[1].letGo();
    }
})

canvas.addEventListener('scroll', event => {
    scrollPosition = document.body.scrollTop;   // or document.documentElement.scrollTop
})