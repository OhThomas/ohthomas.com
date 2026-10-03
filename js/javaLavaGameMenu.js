var menuButtons = [];
var menuButtonOpacity = 0;//1;
const maxMenuTextOpacity = 1;
const maxMenuButtonOpacity = 0.36;//0.13;
const menuButtonColor = "#91D1FF";//"#FF4968";
const menuButtonHeight = 100;
const menuTextColor = "#27BFFF";//"#FF435C";
const menuShadowColor = "#93BADF";//"#FF9999";

function createMenuButton(menuButton,number){
    menuButton.x = canvas.width/2;
    menuButton.y = (canvas.height/4)*(number+((number+1) % 2))
    menuButton.width = 400;
    menuButton.height = menuButtonHeight;
    menuButton.velX = 0;
    menuButton.velY = 0;
    menuButton.color = "#91D1FF";
    menuButton.speed = 5;
    menuButton.acceleration = 5;
    menuButton.xAcceleration = 0;
    menuButton.yAcceleration = 0;
    menuButton.mass = 1;
    menuButton.angularVelocity = 0;
    menuButton.alpha = 0.5;
    menuButton.inertia = 0;
    menuButton.elasticity = 0.1;
    menuButton.angle = 0;
    menuButton.zIndex = 0;
    menuButton.velocity = new Vector(0,0);
    menuButton.grabbed = false;
    menuButton.mouseOffsetX = 0;
    menuButton.mouseOffsetY = 0;
    menuButton.angleAcceleration = 0;
    menuButton.highlighted = false;
    menuButton.clicked = false;
    menuButton.createVertices();
    return menuButton;
}

function createMenu(){
    removeMenu();
    menuButtonOpacity = 0;
    let menuButton = new Rectangle();
    menuButton = createMenuButton(menuButton,1);
    menuButtons.push(menuButton);
    menuButton = new Rectangle();
    menuButton = createMenuButton(menuButton,2);
    menuButtons.push(menuButton);
}

function removeMenu(){
    menuButtons = [];
}

// Mouse over button
function buttonHighlightCheck(){
    let rectTemp = createMouseRectangle();
    rectTemp.x = absPosMouseX;
    rectTemp.y = absPosMouseY;

    for(let i = 0 ; i < menuButtons.length; i++){
        if(checkCollision(menuButtons[i],rectTemp)){
            menuButtons[i].highlighted = true;

        }
        else if(menuButtons[i].highlighted)
            menuButtons[i].highlighted = false;
    }
}

// Click over button
function buttonClickCheck(){
    buttonHighlightCheck();
    if(menuButtons[0].highlighted){
        beginGame();
        mode = 0;
        character1.jumpsLeft = 4;
        highScore = getHighScore();
        difficultyModifier = 1;
        resetStartGesture(startGestureWaitTime/2);
    }
    else if(menuButtons[1].highlighted){
        beginGame();
        mode = 1;
        character1.jumpsLeft = -1;
        highScore = getHighScore();
        difficultyModifier = 0.2;
        resetStartGesture(startGestureWaitTime/2);
    }

}

function modeTextChange(number){
    if(mode == number)
        return "Play Again";
    else if(number == 0)
        return "Normal Mode";
    else if(number == 1)
        return "Easy Mode";//"Free Jump Mode";
}

function menuTick(){
    if(menuButtonOpacity < 1){
        menuButtonOpacity += 0.005;
        if(menuButtonOpacity > 1)
            menuButtonOpacity = 1;
    }
}

function menuRender(){
    const tempStroke = context.strokeStyle;
    const tempFill = context.fillStyle;
    const tempAlpha = context.globalAlpha;
    const tempShadowBlur = context.shadowBlur;
    const tempShadowColor = context.shadowColor;

    const textHeight = menuButtonHeight/2;
    context.font = textHeight+"px KoopasInvadersFont";

    context.save();
    let buttonString;
    for(let i = 0; i < menuButtons.length; i++){
        context.globalAlpha = menuButtonOpacity*maxMenuButtonOpacity;
        context.strokeStye = menuButtonColor;
        context.fillStyle = menuButtonColor;
        context.shadowBlur = 10;
        context.shadowColor = "black";
        if(menuButtons[i].highlighted){
            context.shadowColor = menuShadowColor;
            context.shadowBlur = 15;
        }
        context.beginPath();
        if(context.roundRect == undefined){
            context.fillRect((menuButtons[i].x-(menuButtons[i].width/2)), 
            (menuButtons[i].y-(menuButtons[i].height/2)), menuButtons[i].width, menuButtons[i].height);
            context.closePath();
        }
        else{
            context.roundRect((menuButtons[i].x-(menuButtons[i].width/2)), 
            (menuButtons[i].y-(menuButtons[i].height/2)), menuButtons[i].width, menuButtons[i].height,50);
            context.fill();
        }

        context.globalAlpha = menuButtonOpacity*maxMenuTextOpacity;
        context.strokeStye = menuTextColor;
        context.fillStyle = menuTextColor;
        buttonString = modeTextChange(i);
        const textWidth = context.measureText(buttonString).width
        context.fillText(buttonString,(menuButtons[i].x-(textWidth/2)), 
        (menuButtons[i].y+(textHeight/4)));
    }
    context.restore();

    context.shadowBlur =  tempShadowBlur;
    context.shadowColor = tempShadowColor;
    context.strokeStyle = tempStroke;
    context.fillStyle = tempFill;
    context.globalAlpha = tempAlpha;
}