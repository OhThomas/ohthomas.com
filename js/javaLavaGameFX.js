let playerTrajectoryTriangle;   // when the player is grabbed this triangle will signify their trajectory
let stars = [];                 // background stars

function resetFX(){
    stars = [];
}

function createTrajectoryTriangle(x,y,maxVel){
    playerTrajectoryTriangle = {x1: x-20+(maxVel/5), y1: y+20+(maxVel*3), x2: x+20-(maxVel/5), y2: y+20+(maxVel*3), x3: x-0, y3: y+0};
}

function drawTrajectoryTriangle(maxVel){
    const radius = 4*(maxVel/50); //radius curve
    
    context.moveTo(((playerTrajectoryTriangle.x2+playerTrajectoryTriangle.x3)/2),((playerTrajectoryTriangle.y2+playerTrajectoryTriangle.y3)/2));
    context.arcTo(playerTrajectoryTriangle.x3,playerTrajectoryTriangle.y3,((playerTrajectoryTriangle.x3+playerTrajectoryTriangle.x1)/2),((playerTrajectoryTriangle.y3+playerTrajectoryTriangle.y1)/2),radius);
    context.arcTo(playerTrajectoryTriangle.x1,playerTrajectoryTriangle.y1,((playerTrajectoryTriangle.x1+playerTrajectoryTriangle.x2)/2),((playerTrajectoryTriangle.y1+playerTrajectoryTriangle.y2)/2),radius);
    context.arcTo(playerTrajectoryTriangle.x2,playerTrajectoryTriangle.y2,((playerTrajectoryTriangle.x2+playerTrajectoryTriangle.x3)/2),((playerTrajectoryTriangle.y2+playerTrajectoryTriangle.y3)/2),radius);
    context.closePath();
    
    context.fill();
}

function playerTrajectoryFX(trajectoryVelocity,angle){
    const tempAlpha = context.globalAlpha;
    const tempFillStyle = context.fillStyle;
    const tempStrokeStyle = context.strokeStyle;
    context.lineWidth += 2;
    context.fillStyle = "#FFFFFF";
    context.strokeStyle = "#FFFFFF";
    context.globalAlpha = 0.28;

    context.beginPath();
    context.save();
    context.rotate((Math.PI/2)+angle);
    createTrajectoryTriangle(0,0,trajectoryVelocity);
    drawTrajectoryTriangle(trajectoryVelocity);
    context.restore();
    context.closePath();

    context.globalAlpha = tempAlpha;
    context.fillStyle = tempFillStyle;
    context.strokeStyle = tempStrokeStyle;
    context.lineWidth -= 2;
}

// Creates singular star to push to star array
function createStar(x,y,width,height){
    // Setting parameters
    const rectTemp = new Star();
    let tempX = x;
    if(x == -1)
        tempX = getRandomIntInclusive(0,canvas.width);
    let tempY = y;
    if(y == -1)
        tempY = getRandomIntInclusive(0,canvas.height);
    if(40 < tempY) //y value that activates lava (view it as the atmosphere)
        return;
    let tempWidth = width;
    let tempHeight = height;
    if(width == -1)
        tempWidth = tempHeight = getRandomIntInclusive(3,13);

    // Creating object
    rectTemp.initiate();
    rectTemp.x = tempX;
    rectTemp.y = tempY;
    rectTemp.width = tempWidth;
    rectTemp.height = tempHeight;
    rectTemp.spacebound = true;
    rectTemp.character = 2;
    rectTemp.color = "#FAFAFA";
    rectTemp.createVertices();
    stars.push(rectTemp);
}

// Creates multiple stars
function createStarsGame(y){
    if(Math.random() * 100 == 0)
        return;
    const totalStars = 1+Math.ceil((Math.random()*2));//Math.floor((Math.random()*2));
    let i = 0;
    while(i++ < totalStars){
        let yAdd = getRandomIntInclusive(0,canvas.height/2);
        if(Math.random() > 0.5)
            yAdd *= -1;
        let tempY = y+yAdd;
        if(y == -1)
            tempY = spawnPlatformY-getRandomIntInclusive(0,canvas.height);
        createStar(-1,tempY,-1,-1);
    }
}

class Star extends Rectangle{
    tick(){
        super.tick();
        if(this.dead == 1 && lavaY+canvas.height <= this.y-(this.height/2)){
            const index = stars.indexOf(this);
            stars.splice(index,1);
        }
    }
}
