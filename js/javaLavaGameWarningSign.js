var warningSignInterval;
var warningSignOpacityInterval;
var warningBreachedOpacityInterval;
let warningSignTriangle;                // warning sign before player begins
let warningSignRectangles;
let warningSignCircle;
let warningSignBreachedTriangle;        // warning sign right after player leaves safe zone
let warningSignBreachedRectangle;
let warningSignBreachedCircle;
let warningSignOpacity = 0.3;
let warningSignOpacityVel = 0.01;
let warningSignBreachedOpacity = 0.3;
let warningSignBreachedOpacityVel = 0.01;
let warningSignBreachedScale = 1;
let breachedBreathingCount = 0;

const startingLineY = 40;
let startingLineOffset = 0;
var warningSignFinished = false;
let activatingLava = false;

function resetWarningSign(){
    clearInterval(warningSignInterval);
    clearInterval(warningSignOpacityInterval);
    clearInterval(warningBreachedOpacityInterval);
    warningSignOpacity = 0.3;
    warningSignOpacityVel = 0.01;
    warningSignBreachedOpacity = 0.3;
    warningSignBreachedOpacityVel = 0.01;
    warningSignBreachedScale = 1;
    breachedBreathingCount = 0;
    startingLineOffset = 0;
    lavaY = 0;
    lavaYVel = 0.5;
    lavaSinWaveIncrement = 0;
    lavaSinWaveOffset = 0;
    lavaSinWaveOffsetVel = 0.01;
    activatingLava = false;
    warningSignFinished = false;
}

// Triggers the breached warning sign
function activateLava(){
    if(!activatingLava){
        activatingLava = true;
        warningSignBreachedTriangle = warningSignTriangle;
        warningSignBreachedRectangle = warningSignRectangles;
        warningSignBreachedCircle = warningSignCircle;
        clearInterval(warningBreachedOpacityInterval);
        warningBreachedOpacityInterval = setInterval(this.opacityBreachedBreathe,10);
    }
}

// Creates the sign based on x,y location
function createWarningSignOffset(x,y){
    warningSignTriangle = {x1: x-100, y1: y+60, x2: x-50, y2: y+60, x3: x-75, y3: y+15};
    warningSignRectangles = {x1: x-70, y1: y+25, x2: x-80, y2: y+25, x3: x-77, y3: y+40, x4: x-73, y4: y+40};
    warningSignCircle = {x1: x-75, y1: y+50};
}

function createWarningSign(){
    createWarningSignOffset(canvas.width,0);
    clearInterval(warningSignInterval);
    clearInterval(warningSignOpacityInterval);
    warningSignInterval = setInterval(this.march,20);
    warningSignOpacityInterval = setInterval(this.opacityBreathe,50);
}

function expandTriangle(triangle,scale){
    triangle.y3 = warningSignTriangle.y3+(1-scale);
    triangle.x1 = warningSignTriangle.x1+(1-scale);
    triangle.y1 = warningSignTriangle.y1-(1-scale); 
    triangle.x2 = warningSignTriangle.x2-(1-scale);
    triangle.y2 = warningSignTriangle.y2-(1-scale);
    triangle.x3 = warningSignTriangle.x3;
    return triangle;
}

function expandRectangle(rectangle,scale){
    rectangle.x1 = warningSignRectangles.x1-(1-scale/4);
    rectangle.x2 = warningSignRectangles.x2+(1-scale/4);
    rectangle.x3 = warningSignRectangles.x3+(1-scale/8);
    rectangle.x4 = warningSignRectangles.x4-(1-scale/8);

    rectangle.y1 = warningSignRectangles.y1+(1-scale/4);
    rectangle.y2 = warningSignRectangles.y2+(1-scale/4);
    rectangle.y3 = warningSignRectangles.y3-(1-scale/2.7);
    rectangle.y4 = warningSignRectangles.y4-(1-scale/2.7);
    return rectangle;
}

function expandCircle(circle,scale){
    circle.x1 = warningSignCircle.x1;
    circle.y1 = warningSignCircle.y1-(1-scale/1.6);
}

function warningSignCircleDraw(cameraXOffset,cameraYOffset,scale){
    let radius = 3;
    if(scale != 1)
        radius += (scale/7);
    context.beginPath();
    const cameraX = camera.x-cameraXOffset;
    const cameraY = camera.y-cameraYOffset;

    context.arc(warningSignCircle.x1-cameraX,warningSignCircle.y1-cameraY,radius,0,2*Math.PI);

    context.closePath();
    context.stroke();
    context.fill();
}

function warningSignRectangleDraw(cameraXOffset,cameraYOffset,scale){
    context.beginPath();
    let r = 0.00001; //bezier curve
    const cameraX = camera.x-cameraXOffset;
    const cameraY = camera.y-cameraYOffset;

    if(scale != 1)
        r += (1-scale/20);

    context.moveTo(warningSignRectangles.x2-cameraX-r,warningSignRectangles.y2-cameraY);
    context.quadraticCurveTo(warningSignRectangles.x2-cameraX,warningSignRectangles.y2-cameraY,warningSignRectangles.x2-cameraX,warningSignRectangles.y2+r-cameraY);
    context.lineTo(warningSignRectangles.x3-cameraX,warningSignRectangles.y3-r-cameraY);
    context.quadraticCurveTo(warningSignRectangles.x3-cameraX,warningSignRectangles.y3-cameraY,warningSignRectangles.x3-r-cameraX,warningSignRectangles.y3-cameraY);
    context.lineTo(warningSignRectangles.x4+r-cameraX,warningSignRectangles.y4-cameraY);
    context.quadraticCurveTo(warningSignRectangles.x4-cameraX,warningSignRectangles.y4-cameraY,warningSignRectangles.x4-cameraX,warningSignRectangles.y4-r-cameraY);
    context.lineTo(warningSignRectangles.x1-cameraX,warningSignRectangles.y1+r-cameraY);
    context.quadraticCurveTo(warningSignRectangles.x1-cameraX,warningSignRectangles.y1-cameraY,warningSignRectangles.x1+r-cameraX,warningSignRectangles.y1-cameraY);
    context.closePath();
    

    context.stroke();
    context.fill();
}

function warningSignTriangleDraw(cameraXOffset,cameraYOffset,scale){
    const tempLineWidth = context.lineWidth;
    const radius = 4; //radius curve
    context.beginPath();
    context.lineWidth += 2;
    const cameraX = camera.x-cameraXOffset;
    const cameraY = camera.y-cameraYOffset;

    context.moveTo(((warningSignTriangle.x2+warningSignTriangle.x3)/2)-cameraX,((warningSignTriangle.y2+warningSignTriangle.y3)/2)-cameraY);
    context.arcTo(warningSignTriangle.x3-cameraX,warningSignTriangle.y3-cameraY,((warningSignTriangle.x3+warningSignTriangle.x1)/2)-cameraX,((warningSignTriangle.y3+warningSignTriangle.y1)/2)-cameraY,radius);
    context.arcTo(warningSignTriangle.x1-cameraX,warningSignTriangle.y1-cameraY,((warningSignTriangle.x1+warningSignTriangle.x2)/2)-cameraX,((warningSignTriangle.y1+warningSignTriangle.y2)/2)-cameraY,radius);
    context.arcTo(warningSignTriangle.x2-cameraX,warningSignTriangle.y2-cameraY,((warningSignTriangle.x2+warningSignTriangle.x3)/2)-cameraX,((warningSignTriangle.y2+warningSignTriangle.y3)/2)-cameraY,radius);
    
    context.closePath();
    context.stroke();
    context.lineWidth = tempLineWidth;
    
}

// Used for breached sign to get attention
function expandWarningSign(scale){
    expandTriangle(warningSignBreachedTriangle,scale);
    expandRectangle(warningSignBreachedRectangle,scale);
    expandCircle(warningSignBreachedCircle,scale);
    warningSignTriangle = warningSignBreachedTriangle;
    warningSignRectangles = warningSignBreachedRectangle;
    warningSignCircle = warningSignBreachedCircle;
}

function warningSign(cameraXOffset,cameraYOffset,scale){
    warningSignTriangleDraw(cameraXOffset,cameraYOffset,scale);
    warningSignRectangleDraw(cameraXOffset,cameraYOffset,scale);
    warningSignCircleDraw(cameraXOffset,cameraYOffset,scale);
}

function opacityBreathe(){
    warningSignOpacity += warningSignOpacityVel;

    if(activatingLava){
        if(warningSignOpacityVel > 0)
            warningSignOpacityVel *= -1;

        if(warningSignOpacity >= 0.001)
            warningSignOpacity -= 0.001;
        else{
            warningSignOpacity = 0;
            clearInterval(warningSignOpacityInterval);   
        }
    }

    else{
        if(warningSignOpacity >= 0.9 || warningSignOpacity <= 0.2)
            warningSignOpacityVel *= -1;
    }
}

function opacityBreachedBreathe(){
    if(breachedBreathingCount >= 6){
        if(warningSignBreachedOpacity >= 0){
            warningSignBreachedOpacity -= 0.01;
            return;
        }
        warningSignBreachedOpacity = 0;
        breachedBreathingCount = 0;
        warningSignFinished = true;
        clearInterval(warningBreachedOpacityInterval);
        return;
    }
    if(warningSignBreachedOpacity >= 0.9 || warningSignBreachedOpacity <= 0.2){
        breachedBreathingCount++;
        warningSignBreachedOpacityVel *= -1;
    }
    warningSignBreachedOpacity += warningSignBreachedOpacityVel;
}

// Line that signifies safe zone
function march(){
    startingLineOffset++;
    if (startingLineOffset > 16) {
        startingLineOffset = 0;
    }
}

function startingLineRender(){
    const tempLineWidth = context.lineWidth;
    const tempStroke = context.strokeStyle;
    const tempFill = context.fillStyle;
    const tempLineDash = context.getLineDash();
    context.strokeStyle = "#FFFFFF";
    context.fillStyle = "#FFFFFF";
    context.globalAlpha = warningSignOpacity;
    warningSign(0,0,warningSignBreachedScale);


    if(activatingLava){
        context.globalAlpha = warningSignBreachedOpacity;
        warningSignBreachedScale = 2+warningSignBreachedOpacity*30;
        createWarningSignOffset((canvas.width/2)+75,(canvas.height/2)-37);
        expandWarningSign(warningSignBreachedScale);
        warningSign(camera.x,camera.y,warningSignBreachedScale);
        warningSignBreachedScale = 1;
        createWarningSignOffset(canvas.width,0);    // set back to normal for fade out
        context.globalAlpha = warningSignOpacity;//0.1;
    }

    context.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
    context.lineWidth = 3;
    context.lineDashOffset = -startingLineOffset;
    context.beginPath();
    context.moveTo(0-camera.x,startingLineY-camera.y);
    context.lineTo(canvas.width-camera.x, startingLineY-camera.y);
    context.stroke();
    context.closePath();
    context.strokeStyle = tempStroke;
    context.fillStyle = tempFill;
    context.lineWidth = tempLineWidth;
    context.setLineDash(tempLineDash);
    context.lineDashOffset = 0;
    context.globalAlpha = 1;
}