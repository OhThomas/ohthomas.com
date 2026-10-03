var mouseXGame = 0;
var mouseYGame = 0;
var absPosMouseX = 0;
var absPosMouseY = 0;
var scrollPosition = document.body.scrollTop;

var mouseDown = 0;
var clickTimeout;

// Deleting space and arrow keys
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

function  getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

  return {
    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}

function updateMousePos(){
    mouseXGame = absPosMouseX+camera.x;
    mouseYGame = absPosMouseY+camera.y;
}

function updateMouseGrab(xOffset,yOffset){
    character1.firstMouseX += xOffset;
    character1.firstMouseY -= yOffset;
    updateMousePos();
}

// Creates square at mouse to detect collision with mouse and objects
function createMouseRectangle(){
    const rectTemp = new Character();
    rectTemp.x = mouseXGame;
    rectTemp.y = mouseYGame;
    rectTemp.width = 1;
    rectTemp.height = 1;
    rectTemp.velX = 0;
    rectTemp.velY = 0;
    rectTemp.angle = 0;
    rectTemp.createVertices();
    return rectTemp;
}

// Unified function for mousemove and touchmove listeners
function inputMove(eventX,eventY){
    var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y
    absPosMouseX = ((eventX - rect.left) * scaleX);
    absPosMouseY = ((eventY - rect.top) * scaleY);
    updateMousePos();
    
    if(!gameStart && menuButtons.length > 0){
        buttonHighlightCheck();
    }
}

// Unified function for mousedown and touchstart listeners
function inputPress(){
    mouseDown = 1;
    updateMousePos();
    const rectTemp = createMouseRectangle();

    if(!gameStart && menuButtons.length > 0)
        buttonHighlightCheck();
    else{
        if(checkCollision(character1,rectTemp) == true){
            character1.grab(mouseXGame,mouseYGame);
            if(!activatingLava)
                resetStartGesture(-1);
        }
    }
}

// Unified function for mouseup, mouseleave and touchend listeners
function inputRelease(){
    if(mouseDown == 1){
        mouseDown = 0;
        character1.letGo();
    }
}

function touchMoveGameFunc(event){inputMove(event.touches[0].pageX,event.touches[0].pageY);}

function touchStartGameFunc(event){
        // if(event.touches[0].buttons == 1){ // left mouse click
        var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y
        absPosMouseX = ((event.touches[0].pageX - rect.left) * scaleX);
        absPosMouseY = ((event.touches[0].pageY - rect.top) * scaleY);
        inputPress();
}

function touchEndGameFunc(event){inputRelease();}

function mouseMoveGameFunc(event){inputMove(event.clientX,event.clientY);}

function mouseUpGameFunc(event){
    inputRelease();
    if(!gameStart && menuButtons.length > 0){
        buttonClickCheck();
    }
}

function mouseDownGameFunc(event){
    if(event.buttons == 1){ // left mouse click
        inputPress();
    }
}

function mouseLeaveGameFunc(event){ inputRelease(); }

function scrollGameFunc(event){ scrollPosition = document.body.scrollTop; }   // or document.documentElement.scrollTop }

// Initiates mouse and touch listeners
function canvasMouseListeners(){
    canvas.addEventListener('touchmove', touchMoveGameFunc, false);
    canvas.addEventListener('touchstart', touchStartGameFunc, false);
    document.addEventListener('touchend', touchEndGameFunc, false);

    document.addEventListener('mousemove',mouseMoveGameFunc, false);
    document.addEventListener('mouseup', mouseUpGameFunc, false);
    document.addEventListener('mousedown', mouseDownGameFunc, false);
    document.addEventListener('mouseleave', mouseLeaveGameFunc, false);
    document.addEventListener('scroll', scrollGameFunc, false);
}

function removeGameListeners(){
    // if(myDomain()){
        canvas.removeEventListener('touchmove', touchMoveGameFunc, false);
        canvas.removeEventListener('touchstart', touchStartGameFunc, false);
        document.removeEventListener('touchend', touchEndGameFunc, false);

        document.removeEventListener('mousemove',mouseMoveGameFunc, false);
        document.removeEventListener('mouseup', mouseUpGameFunc, false);
        document.removeEventListener('mousedown', mouseDownGameFunc, false);
        document.removeEventListener('mouseleave', mouseLeaveGameFunc, false);
        document.removeEventListener('scroll', scrollGameFunc, false);
    // }
}