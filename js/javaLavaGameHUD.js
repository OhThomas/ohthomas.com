let highScore = 0;
let hudAlpha = 0;

// Top right score
let scoreAlpha = 0;
let scoreScale = 1;
let scoreX = 50;
let scoreY = 10;
let scoreWidth = 0;
let scoreHeight = 20;

// Top right red meter
let lavaHUDHeight; //= canvas.height/4;
let lavaHUDWidth; //= canvas.width/32;
let lavaHUDX;
let lavaHUDY;
let lavaHUDPercentage = 0;
let lavaHUDLargestDistance = 0;

// Bottom middle warning sign when lava is close
let lavaAlertHUDHeight;
let lavaAlertHUDWidth;
let lavaAlertHUDX;
let lavaAlertHUDY;
let lavaAlertHUDAlpha = 0;
let lavaAlertHUDScale = 0;
let lavaAlertHUDScaleAcceleration = 0.1;
const lavaAlertDistance = 700;

// Mouse icon showing user what to do if inactive
let startGestureTriangle;
let startGesture = false;
let startGestureXOffset = 0;
let startGestureYOffset = 0;
let startGestureOpacity = 0.28;
const startGestureXBeginOffset = 50;
const startGestureWaitTime = 20000;
let startGestureInterval;

function resetHUD(){
    startGesture = false;
    clearInterval(startGestureInterval);
}

function createHUD(){
    scoreScale = 1;
    scoreX = 50;
    scoreY = 10;
    scoreWidth = 0;
    scoreHeight = 20;

    lavaHUDHeight = canvas.height/3;
    lavaHUDWidth = canvas.width/64;//32;
    lavaHUDX = canvas.width - (canvas.width/64) - 25;
    lavaHUDY = 0 + 25;//+ ((canvas.height/4)/4);
    hudAlpha = 0;
    lavaHUDPercentage = 0;
    lavaHUDLargestDistance = 0;

    lavaAlertHUDHeight = 40;
    lavaAlertHUDWidth = 100;
    lavaAlertHUDX = canvas.width/2 + 75;
    lavaAlertHUDY = canvas.height - 95;
    lavaAlertHUDAlpha = 0;
    lavaAlertHUDScale = 0;
    lavaAlertHUDScaleAcceleration = 0.1;

    startGesture = false;
    startGestureXOffset = 0;
    startGestureYOffset = 0;
    startGestureOpacity = 0.28;
    createStartGestureTriangleOffset(0,0);
    clearInterval(startGestureInterval);
    startGestureInterval = setInterval(startGestureWait,10000);

    highScore = getHighScore();
}

function getHighScore(){
    if(mode == 1)
        return localStorage.getItem("highScoreEasy");
    else
        return localStorage.getItem("highScoreNormal");
}

function setHighScore(score){
    if(mode == 1)
        localStorage.setItem("highScoreEasy",score);
    else
        localStorage.setItem("highScoreNormal",score);
    highScore = score;
}

function hudAlphaLogic(){
    if(hudAlpha < 1 && activatingLava && !gameOver){
        hudAlpha += 0.01;
        if(hudAlpha > 1)
            hudAlpha = 1;
    }
    else if(hudAlpha > 0 && gameOver){
        hudAlpha -= 0.01;
        if(hudAlpha < 0)
            hudAlpha = 0;
    }
}

function scoreLogic(){
    const textHeightTemp = 20 * scoreScale;
    context.font = textHeightTemp+"px KoopasInvadersFont";
    const buttonString = "Score: "+String(score);
    const textWidthTemp = context.measureText(buttonString).width;
    if(scoreWidth != textWidthTemp)
        scoreWidth = textWidthTemp;
    if(scoreHeight != textHeightTemp)
        scoreHeight = textHeightTemp;
    if(gameOver){
        if(scoreScale < 2){
            scoreScale += 0.01;
        }
        if(scoreX < (canvas.width/2)-(scoreWidth/2))
            scoreX += 1.5;
        if(scoreY < (canvas.height/2)-(scoreHeight/2)-14)
            scoreY += 1.5;
    }
}

// Determining what the top right red meter should be
function lavaHUDPercentageCalculation(){
    const currentDiff = (character1.y+(character1.height/2)) - (lavaY+canvas.height);
    if(currentDiff < lavaHUDLargestDistance)
        lavaHUDLargestDistance = currentDiff;

    lavaHUDPercentage = currentDiff/lavaHUDLargestDistance;
    lavaHUDPercentage = clamp(lavaHUDPercentage, 0 , 100);
}

function lavaAlertScaleLogic(){
    if(lavaAlertHUDScale > 10 || lavaAlertHUDScale < 1){
        if(lavaAlertHUDScale > 10 && lavaAlertHUDScaleAcceleration > 0)
            lavaAlertHUDScaleAcceleration *= -1;
        else if(lavaAlertHUDScale < 1 && lavaAlertHUDScaleAcceleration < 0)
            lavaAlertHUDScaleAcceleration *= -1;
    }
    lavaAlertHUDScale += lavaAlertHUDScaleAcceleration;
}

function lavaAlertHUDLogic(){
    const currentDiff = (character1.y+(character1.height/2)) - (lavaY+canvas.height);
    if(warningSignFinished && currentDiff > -lavaAlertDistance && !gameOver){
        if(lavaAlertHUDAlpha < 1){
            lavaAlertHUDAlpha += 0.01;
            if(lavaAlertHUDAlpha > 1)
                lavaAlertHUDAlpha = 1;
        }
        lavaAlertScaleLogic();
    }
    else if(lavaAlertHUDAlpha > 0 && (currentDiff < -lavaAlertDistance || gameOver)){ //&& !gameOver){
        lavaAlertHUDAlpha -= 0.01;
        if(lavaAlertHUDAlpha < 0)
            lavaAlertHUDAlpha = 0;
        lavaAlertScaleLogic();
    }
}

function jumpsLeftRender(){
    const textNumberRatio = 2.4;

    const textHeight = 20;
    context.font = textHeight+"px KoopasInvadersFont";
    const buttonString = "Jumps Left: ";
    const textWidth = context.measureText(buttonString).width;
    context.shadowBlur = 10;
    context.shadowColor = "black";
    context.strokeStye = menuTextColor;
    context.fillStyle = menuTextColor;
    context.globalAlpha = hudAlpha;
    context.fillText(buttonString,((10)),( 
    (10*textNumberRatio)+(textHeight)));

    // score
    const textHeight2 = textHeight*textNumberRatio;
    const textHeight2Displacement = textHeight/textNumberRatio;
    const shadowBlur2 = textHeight;
    context.font = textHeight2+"px KoopasInvadersFont";
    const buttonString2 = String(character1.jumpsLeft);
    context.shadowBlur = shadowBlur2;
    context.fillText(buttonString2,((10)+(textWidth)),( 
    (10)+(textHeight2-textHeight2Displacement)));
}

function scoreRender(){
    context.font = scoreHeight+"px KoopasInvadersFont";
    const buttonString = "Score: "+String(score);
    context.shadowBlur = 10;
    context.shadowColor = "black";
    context.strokeStye = menuTextColor;
    context.fillStyle = menuTextColor;
    if(gameOver)
        context.globalAlpha = 1;
    else
        context.globalAlpha = hudAlpha;
    context.fillText(buttonString,((canvas.width)-(scoreWidth+scoreX)),( 
    (scoreY)+(scoreHeight)));
}

function highScoreRender(){
    const textHeight = 25;
    context.font = textHeight+"px KoopasInvadersFont";
    const buttonString = "High Score: "+String(highScore);
    const textWidth = context.measureText(buttonString).width;
    context.shadowBlur = 10;
    context.shadowColor = "black";
    context.strokeStye = menuTextColor;
    context.fillStyle = menuTextColor;
    if(!gameStart && !gameOver)
        context.globalAlpha = menuButtonOpacity;
    else
        context.globalAlpha = 1-hudAlpha;
    context.fillText(buttonString,((canvas.width/2)-(textWidth/2)),( 
    (15)+(textHeight/2)));
}

function resetStartGesture(waitTime){
    let waitTimeTemp = waitTime;
    if(waitTime == -1)
        waitTimeTemp = startGestureWaitTime;
    startGestureXOffset = 0;
    startGestureYOffset = 0;
    startGestureOpacity = 0.28;
    startGesture = false;
    clearInterval(startGestureInterval);
    startGestureInterval = setInterval(startGestureWait,waitTimeTemp);
}

function startGestureWait(){
    if(mode != -1 && !activatingLava){
        if(!startGesture){
            startGesture = true;
            startGestureXOffset = startGestureXBeginOffset;
        }
    }
    else if(mode != -1 && activatingLava)
        clearInterval(startGestureInterval);
}

function createStartGestureTriangleOffset(x,y){
    startGestureTriangle = {x1: x, y1: y+15, x2: x, y2: y+60, x3: x+10, y3: y+50, x4: x+30, y4: y+48};
}

function startGestureLogic(){
    if(startGesture){
        if(activatingLava){
            startGesture = false;
            clearInterval(startGestureInterval);
            return;
        }
        if(startGestureXOffset > 0)
            startGestureXOffset-=1.2;
        else if(startGestureYOffset < 50)
            startGestureYOffset+=1.2;
        else if(startGestureOpacity > 0){
            startGestureOpacity-=0.005;
        }
        else{
            resetStartGesture(-1);
        }
    }
}

function startGestureTriangleDraw(cameraXOffset,cameraYOffset){
    const tempAlpha = context.globalAlpha;
    context.strokeStyle = "#FFFFFF";
    context.fillStyle = "#FFFFFF";
    context.beginPath();
    context.globalAlpha = startGestureOpacity;
    const cameraX = camera.x-cameraXOffset;
    const cameraY = camera.y-cameraYOffset;

    context.moveTo(((startGestureTriangle.x3+startGestureTriangle.x4)/2)-cameraX,((startGestureTriangle.y3+startGestureTriangle.y4)/2)-cameraY);
    context.lineTo(startGestureTriangle.x4-cameraX,startGestureTriangle.y4-cameraY,((startGestureTriangle.x4+startGestureTriangle.x1)/2)-cameraX,((startGestureTriangle.y4+startGestureTriangle.y1)/2)-cameraY);//,radius);
    context.lineTo(startGestureTriangle.x1-cameraX,startGestureTriangle.y1-cameraY,((startGestureTriangle.x1+startGestureTriangle.x2)/2)-cameraX,((startGestureTriangle.y1+startGestureTriangle.y2)/2)-cameraY);//,radius);
    context.lineTo(startGestureTriangle.x2-cameraX,startGestureTriangle.y2-cameraY,((startGestureTriangle.x2+startGestureTriangle.x3)/2)-cameraX,((startGestureTriangle.y2+startGestureTriangle.y3)/2)-cameraY);//,radius);
    context.lineTo(startGestureTriangle.x3-cameraX,startGestureTriangle.y3-cameraY,((startGestureTriangle.x3+startGestureTriangle.x4)/2)-cameraX,((startGestureTriangle.y3+startGestureTriangle.y4)/2)-cameraY);//,radius);
    context.closePath();
    context.stroke();
    context.fill();
    context.globalAlpha = tempAlpha;
    
}

function hudTick(){
    scoreLogic();

    hudAlphaLogic();

    lavaHUDPercentageCalculation();

    lavaAlertHUDLogic();

    startGestureLogic();
}

function hudRender(){

    const tempStroke = context.strokeStyle;
    const tempFill = context.fillStyle;
    const tempAlpha = context.globalAlpha;

    // Drawing outline
    context.strokeStyle = "#FFFFFF";
    context.globalAlpha = hudAlpha;

    context.strokeRect(lavaHUDX,lavaHUDY,lavaHUDWidth,lavaHUDHeight);

    // Drawing lava in hud
    context.strokeStyle = "#FF0000";
    context.fillStyle = "#FF0000";
    context.fillRect(lavaHUDX,lavaHUDY+(lavaHUDHeight)-(lavaHUDHeight*(1-lavaHUDPercentage)),lavaHUDWidth,lavaHUDHeight*(1-lavaHUDPercentage));

    // Drawing alert triangle
    if(lavaAlertHUDAlpha > 0){
        context.strokeStyle = "#FFFFFF";
        context.fillStyle = "#FFFFFF";
        context.globalAlpha = lavaAlertHUDAlpha;

        createWarningSignOffset(lavaAlertHUDX,lavaAlertHUDY);
        expandWarningSign(lavaAlertHUDScale);
        warningSign(camera.x,camera.y,lavaAlertHUDScale);
    } 

    if(mode == 0)
        jumpsLeftRender();

    if(mode != -1)
        scoreRender();

    if(mode != -1 && startGesture)
        startGestureTriangleDraw(character1.x+startGestureXOffset,character1.y-(character1.height/2)+startGestureYOffset);

    highScoreRender();

    context.strokeStyle = tempStroke;
    context.fillStyle = tempFill;
    context.globalAlpha = tempAlpha;
}