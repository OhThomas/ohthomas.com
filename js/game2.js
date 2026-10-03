// Initialize canvas and context
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
var camera = { x: 0, y: 0 };
var frameCount = 60;
var paused = false;
var pausedVisualFeedback;
var lastUpdate;
var dt;
var tickV;
var renderV;
let running = false;
var entities = [];

function startGame(){
    if(running){
        endGame(); //delete
        return;
    }
    running = true;
    document.body.appendChild(canvas);
    canvas.width = 640;
    canvas.height = 360;
    canvas.style.position = 'relative';
    console.log("canvas style = "+canvas.style.display);
    canvas.style.display = "";
    createPlayers();
    // character1.x = 100;
    // character2.x = 400;
    // Run game loop
    tickV = setInterval(tick, 1000/60);
    renderV = setInterval(render, 1000/frameCount);
}

function endGame(){
    if(running){
        entities = [];
        clearInterval(tickV);
        clearInterval(renderV);
        clearInterval(pausedVisualFeedback);
        clearInterval(waveInterval);
        document.body.removeChild(canvas);
        paused = false;
        running = false;

        //game2Player.js
        waveActivation = 0;
        waveCount = 0;

        //game2Mouse.js
        mouseX = 0;
        mouseY = 0;
        mouseDown = 0;
    }
}

// Initialize keyboard controls
const keys = {};
window.addEventListener('keydown', event => {
    keys[event.keyCode] = true;
});
window.addEventListener('keyup', event => {
    releasedInputs(event);
    keys[event.keyCode] = false;
});

function releasedInputs(e){
    if(!running)
        return;
    if (e.keyCode == 80){
        paused = !paused;
        if(paused)
            renderPaused();
        else
            clearInterval(pausedVisualFeedback);
    }
    if (keys[16]){
        if(character1.rotationLock)
            character1.rotationLock = false;
    }
    if (keys[32]){
        character1.shoot();
    }
}

function input(){
    if(!running)
        return;
    // Move character 1
    if (keys[65]) { // A key
        velXT(character1,-1)
    } else if (keys[68]) { // D key
        velXT(character1,1)
    } if (keys[87]) { // W key
        velYT(character1,-1)
    } else if (keys[83]) { // S key
        velYT(character1,1)
    }

    // Move character 2
    if (keys[37]) { // Left arrow key
        velXT(character2,-1)
    } else if (keys[39]) { // Right arrow key
        velXT(character2,1)
    } if (keys[38]) { // Up arrow key
        velYT(character2,-1)
    } else if (keys[40]) { // Down arrow key
        velYT(character2,1)
    }
    
    if (keys[16]){
        // character1.x += character1.velX;
        character1.reOrient();
        character1.rotationLock = true;
    }
}

function renderPaused(){
    let looper = 0;
    pausedVisualFeedback = setInterval(function(){
        if(looper == 0){
            context.clearRect(0, 0, canvas.width, canvas.height);
            looper = 1;
        }
        else{
            
            context.clearRect(0, 0, canvas.width, canvas.height);
            character1.render(context);
            character2.render(context);
            looper = 0;
        }
    }, 500);
}

function cameraFill(x,y,width,height){
    const cameraXDiff = x-camera.x;
    const cameraYDiff = y-camera.y;
    // context.fillRect(x-camera.x,y-camera.y,width,height);
    context.fillRect(x-cameraXDiff,y-cameraYDiff,width,height);
}

// Draws
function render(){
    if(paused)
        return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    character1.render();
    character2.render();
    
    // character1.render(context);
    // character2.render(context);
}

// Update characters
function tick() {
    const now = Date.now();
    dt = (now - lastUpdate) / 1000;
    lastUpdate = now;
    
    if(paused == false){
        input();
        for (let i = 0; i < entities.length; i++) {
            physics(entities[i]);
        }
    }

    // Renders to tick count (remove it from setInterval on startGame() to use this)
    // render();
}