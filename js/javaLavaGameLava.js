let lavaSinWaveIncrement = 0;
let lavaSinWaveOffset = 0;
let lavaSinWaveOffsetVel = 0.01;
var lavaY = 0;
let lavaYVel = 0.5;
const lavaYVelOriginal = 0.5;
const lavaRubberBandAmount = 1500;  // Max distance lava can be from player

function lavaSinWave(){
    const wave = {
        y: canvas.height,
        length: 0.01,
        amplitude: 20,
        frequency: 0.01
    }
    lavaSinWaveIncrement++;
    if(lavaSinWaveOffset > 16 || lavaSinWaveOffset < 0 )
        lavaSinWaveOffsetVel *= -1;
    lavaSinWaveOffset += lavaSinWaveOffsetVel;

    context.beginPath();
    for (let i = 0; i < canvas.width; i++) {
        context.lineTo(i-camera.x, wave.y + Math.sin(lavaSinWaveIncrement / 50) * wave.amplitude * Math.sin(i * wave.length + wave.frequency + lavaSinWaveOffset) - camera.y + lavaY)
    }
    context.stroke();  // draw stroke along wave top only
  
    context.lineTo(canvas.width-camera.x, canvas.height-camera.y) // bottom right
    context.lineTo(0-camera.x, canvas.height-camera.y)            // bottom left
    context.fill()
    context.closePath();
}

function sillyIncrementPyramid(){ // silly for lack of a harsher word
    if(lavaYVelOriginal >= lavaYVel && character1.y < -200)
        lavaYVel *= 2; // change 2 based on if playing normal mode or free jump mode
    else if(lavaYVelOriginal >= lavaYVel/2 && character1.y < -600)
        lavaYVel *= 1.2;
    else if(lavaYVelOriginal >= lavaYVel/(2*1.2) && character1.y < -1000)
        lavaYVel *= 1.2;
    else if(lavaYVelOriginal >= lavaYVel/(2*1.2*1.2) && character1.y < -5000)
        lavaYVel *= 1.2;
    else if(lavaYVelOriginal >= lavaYVel/(2*1.2*1.2*1.2) && character1.y < -10000)
        lavaYVel *= 1.2;
    else if(lavaYVelOriginal >= lavaYVel/(2*1.2*1.2*1.2*1.2) && character1.y < -15000)
        lavaYVel *= 1.2;
    else if(lavaYVelOriginal >= lavaYVel/(2*1.2*1.2*1.2*1.2*1.2) && character1.y < -20000)
        lavaYVel *= 1.1;
    else if(lavaYVelOriginal >= lavaYVel/(2*1.2*1.2*1.2*1.2*1.2*1.1) && character1.y < -50000)
        lavaYVel *= 1.1;
    else if(lavaYVelOriginal >= lavaYVel/(2*1.2*1.2*1.2*1.2*1.2*1.1*1.1) && character1.y < -100000)
        lavaYVel *= 1.1;
    else if(lavaYVelOriginal >= lavaYVel/(2*1.2*1.2*1.2*1.2*1.2*1.1*1.1*1.1) && character1.y < -200000)
        lavaYVel *= 1.1;
    else if(lavaYVelOriginal >= lavaYVel/(2*1.2*1.2*1.2*1.2*1.2*1.1*1.1*1.1*1.1) && character1.y < -500000)
        lavaYVel *= 1.2;
    else if(lavaYVelOriginal >= lavaYVel/(2*1.2*1.2*1.2*1.2*1.2*1.1*1.1*1.1*1.1*1.2) && character1.y < -1000000)
        lavaYVel *= 1.2;
    else if(lavaYVelOriginal >= lavaYVel/(2*1.2*1.2*1.2*1.2*1.2*1.1*1.1*1.1*1.1*1.2*1.2) && character1.y < -10000000)
        lavaYVel *= 1.2;
}

function lavaTick(){
    //if character is so high increase lavaYVel
    sillyIncrementPyramid();

    if(!gameOver)
        lavaY -= lavaYVel;
    if(lavaY+canvas.height >= character1.y+(character1.height/2) + lavaRubberBandAmount)
        lavaY = character1.y+(character1.height/2) + 1500 - canvas.height;
}

function lavaRender(){
    const tempStroke = context.strokeStyle;
    const tempFill = context.fillStyle;

    context.strokeStyle = "#FF0000";
    context.fillStyle = "#FF0000";

    lavaSinWave();

    context.strokeStyle = tempStroke;
    context.fillStyle = tempFill;
}