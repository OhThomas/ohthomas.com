// Initialize canvas and context
// const canvas = document.createElement('canvas');
let canvas = document.getElementById('canvas');
if(canvas == null)
    canvas = document.createElement('canvas');
canvas.id = 'canvas';
const context = canvas.getContext('2d');

const framesPerSecond = 60; // * ((context.roundRect == undefined) ? 1.8 : 1);
const ticksPerSecond = 60;
var frameCount = 0;
var tickCount = 0;
var time = Date.now();
var paused = false;
var lastUpdate;
var tickInterval;
var renderInterval;
var pausedFeedbackInterval;
let running = false;
var gameOver = false;
var gameStart = false;
var mode = -1;
var difficultyModifier = 1;
var score = 0;
var blocks = [];  // blocks that fall
var blackHoles = [];

function resetGame(){
    blocks = [];
    clearInterval(pausedFeedbackInterval);
    clearInterval(waveInterval);
    clearInterval(opacityInterval);
    paused = false;
    gameOver = false;
    gameStart = false;
    score = 0;

    //game2Player.js
    waveActivation = 0;
    waveCount = 0;

    //game2Mouse.js
    mouseXGame = 0;
    mouseYGame = 0;
    mouseDown = 0;

    //javaLavaGameWarningSign.js
    resetWarningSign();

    //javaLavaGamePlatform.js
    resetPlatforms();

    //javaLavaGameBlackHoles.js
    resetBlackHoles();

    //javaLavaGameFX.js
    resetFX();

    //javaLavaGameHUD.js
    resetHUD();
}

function createStartingGame(){
    createWarningSign();
    createPlayer();
    createHUD();
    createMenu();
    createStarsGame(canvas.height);
    createStarsGame(0);
    createPlatform((canvas.width/2),(canvas.height/2) + 60,0,0,0,0,0,200,10,false);
    createPlatform((canvas.width/2),(canvas.height/2) - 60,0,0,0,0,0,200,10,true);//#ab1cff(purple)
    createPlatform((canvas.width/2) - 200,(canvas.height/2) - 200,0,10,0,140,0.01,200,10,false);
    createPlatform((canvas.width/2) + 200,(canvas.height/2) - 200,0,10,0,140,0.01,200,10,false);
    spawnYOffset = (canvas.height/2) + 10;
    startingLinePassed = false;
    mode = -1;
}

function createGame(){
    if(running){
        endGame();
        // document.removeEventListener("mousedown",canvasMouseListeners);     // only do if ohthomas.com
        // document.removeEventListener("mouseup",canvasMouseListeners);       // only do if ohthomas.com
        // document.removeEventListener("mousemove",canvasMouseListeners);     // only do if ohthomas.com
        // document.removeEventListener("mouseleave",canvasMouseListeners);    // only do if ohthomas.com
        // document.removeEventListener("scroll",canvasMouseListeners);        // only do if ohthomas.com


        
        // if(myDomain()){
        //     setListener();        // only do if ohthomas.com
        //     setMouseEvents();     // only do if ohthomas.com
        // }
        return;
    }
    running = true;
    document.body.appendChild(canvas);
    // if(myDomain()){
        // document.removeEventListener("mousedown",setListener,false);      // only do if ohthomas.com
        // document.removeEventListener("mouseup",setListener,false);        // only do if ohthomas.com
        // document.removeEventListener("mousemove",mousePosition,false);    // only do if ohthomas.com 
        // document.removeEventListener("mouseleave",setMouseEvents,false);  // only do if ohthomas.com
        // document.removeEventListener("scroll",setMouseEvents,false);      // only do if ohthomas.com
    // }
    canvas.width = 640;//800;
    canvas.height = 360;//600;
    canvas.style.position = 'relative';
    canvas.style.display = "";
    canvas.style.backgroundColor = "#1C1624"; // DELETE THIS
    canvasMouseListeners();
    createLocalStorage();
    createStartingGame();

    tickInterval = setInterval(tick, 1000/ticksPerSecond);
    renderInterval = setInterval(render, 1000/framesPerSecond);
}

function endGame(){
    if(running){
        resetGame();
        removeMenu();
        clearInterval(tickInterval);
        clearInterval(renderInterval);
        document.body.removeChild(canvas);
        mode = -1;
        running = false;
        removeGameListeners();
    }
}

function beginGame(){
    menuButtonOpacity = 0;
    for(let i = 0; i < menuButtons.length; i++){
        menuButtons[i].highlighted = false;
    }
    if(gameOver){
        gameOver = false;
        resetGame();
        createStartingGame();
    }
    gameStart = true;
}

function gameOverFunc(){
    gameOver = true;
    gameStart = false;
    paused = false;
    character1.grabbed = false;
    const highScoreTemp = getHighScore();
    console.log("Score = "+score+"\tHigh Score = "+highScore);
    if(highScoreTemp == null || highScoreTemp < score){
        setHighScore(score);
    }
    buttonHighlightCheck();
}

function renderObjects(){
    for(i = 0; i < stars.length; i++){
        stars[i].render();
    }

    if(!warningSignFinished && gameStart)
        startingLineRender();

    for(let i = 0; i < platforms.length; i++){
        platforms[i].render();
    }
    for(i = 0; i < blocks.length; i++){
        blocks[i].render();
    }
    character1.render();

    for(i = 0; i < blackHoles.length; i++){
        blackHoles[i].render();
    }

    if(activatingLava)
        lavaRender();

    hudRender(); // where shadow comes from on everything also
}

function renderPaused(){
    let looper = 0;
    pausedFeedbackInterval = setInterval(function(){
        if(looper == 0){
            context.clearRect(0, 0, canvas.width, canvas.height);
            looper = 1;
        }
        else{
            context.clearRect(0, 0, canvas.width, canvas.height);
            renderObjects();
            looper = 0;
        }
    }, 500);
}

// Draws
function render(){
    frameCount++;
    if(paused)
        return;
    context.clearRect(0, 0, canvas.width, canvas.height);

    renderObjects();

    if(!gameStart)
        menuRender();
}

// Updates
function tick() {
    tickCount++;
    const now = Date.now();
    lastUpdate = now;
    
    if(time + 1000 <= now){
        console.log("Ticks: "+tickCount+"\tFrames: "+frameCount);
        time = now;
        tickCount = 0;
        frameCount = 0;
    }

    if(paused == false){
        if(!activatingLava){
            if(character1.y-(character1.height/2) <= 40)
                activateLava();
        }
        else
            lavaTick();

        input();
        platformPhysics();
        if(gameStart)
            platformTicks();
        for(let i = 0; i < blocks.length; i++){
            blocks[i].tick();

            // deleting if below lava
            if(lavaY + canvas.height < blocks[i].y - (blocks[i].height/2))
                blocks.splice(i,1);
        }
        character1.tick();
        physics(character1);
        spawnPlatforms();
        hudTick();
    }

    if(!gameStart)
        menuTick();

    for(i = 0; i < stars.length; i++){
        stars[i].tick();
    }
    for(let j = 0; j < blackHoles.length; j++){
        blackHoles[j].tick();
    }

    cameraTick();

    const currentPoint = Math.round((character1.y * -1) -40);
    if(currentPoint > score)
        score = currentPoint;
}