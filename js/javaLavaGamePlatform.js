var platforms = [];
var opacityInterval;
let spawnPlatformY = 0;//60;            // spawn location that gets triggered when player passes it
let spawnYOffset;                       // how much we push the spawn location back
let platAlpha = 0.4;
let platAlphaVel = 0.02;
let platAlphaTimer = Date.now();
let lastPlatformLayout = -1;            // makes sure to spawn platforms every so often
const spawnBlockLinePercentage = 0.03;

class Platform extends Rectangle{
    constructor(x,y,velX,velY,width,height,color,speed,maxSpeed,maxAcceleration,acceleration,
        xAcceleration,yAcceleration,angularVelocity,alpha,inertia,elasticity,angle,zIndex){
        super(x,y,velX,velY,width,height,color,speed,maxSpeed,maxAcceleration,acceleration,0,xAcceleration,yAcceleration,
            0,angularVelocity,alpha,inertia,elasticity,angle,zIndex);
        this.velocity = new Vector(0,0);
        this.grabbed = false;
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;
        this.angleAcceleration = 0;
        this.passThru = false;          // Used to let player go through bottom
        this.blueString = "";
        this.greenString = "";
        this.redString = "";
        
        this.vertices = [
            new Vector(-width/2, -height/2),
            new Vector(width/2, -height/2),
            new Vector(width/2, height/2),
            new Vector(-width/2, height/2)
        ];

        // Rotate the vertices by the initial angle...
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].rotate(this.angle);
        }
    }

    tick(){
        if(this.velY > -this.maxVelY || this.velY < this.maxVelY){ // velY not at max
            if(this.y < this.yDestination)
                this.velY += this.acceleration;
            else
                this.velY -= this.acceleration;
        }
        if(this.velX > -this.maxVelX || this.velX < this.maxVelX){ // velX not at max
            if(this.x < this.xDestination)
                this.velX += this.acceleration;
            else
                this.velX -= this.acceleration;
        }
        this.x += this.velX;
        this.y += this.velY;
        this.position = new Vector(this.x,this.y);
        this.velocity = new Vector(this.velX,this.velY);

        if(lavaY + canvas.height < this.y - (this.height/2)){
            const index = platforms.indexOf(this);
            platforms.splice(index,1);
        }
    }

    angleTranslate(){
        context.save();
        if(this.passThru)
            context.globalAlpha = platAlpha;//0.1;
        context.translate(this.x, this.y);
        if(!this.rotationLock)
            context.rotate(this.angle);
        context.beginPath();
        // context.roundRect((-this.width/2)-camera.x, (-this.height/2)-camera.y, this.width, this.height,50);
        if(context.roundRect == undefined){
            context.fillRect((-this.width/2)-camera.x, (-this.height/2)-camera.y, this.width, this.height);
            context.closePath();
        }
        else{
            context.roundRect((-this.width/2)-camera.x, (-this.height/2)-camera.y, this.width, this.height,50);
            context.stroke();
            context.fill();
        }
        context.restore();
        if(this.passThru)
            context.globalAlpha = 1;
    }

    applyTorqueForce(fx, fy, torque) {
        return;
    }

    decideColor(){
        if(this.maxVelX != 0 || this.maxVelY != 0)
            this.color = "#28ffdb";
        else
            this.color = "#2a8bdf";
    }
}

function createPlatform(x,y,maxVelX,maxVelY,xTravel,yTravel,acceleration,width,height,passThru){
    let tempPlat = new Platform();
    tempPlat.x = x;
    tempPlat.y = y;
    tempPlat.velX = 0;
    tempPlat.velY = 0;
    tempPlat.maxVelX = maxVelX;
    tempPlat.maxVelY = maxVelY;
    tempPlat.xTravel = xTravel;
    tempPlat.yTravel = yTravel;
    tempPlat.xDestination = x+xTravel/2;
    tempPlat.yDestination = y+yTravel/2;
    tempPlat.acceleration = acceleration;
    tempPlat.width = width;
    tempPlat.height = height;
    tempPlat.mass = 1;
    tempPlat.inertia = 0;
    tempPlat.angle = 0;
    tempPlat.passThru = passThru;

    tempPlat.grabbed = false;
    tempPlat.rotationLock = true;

    tempPlat.decideColor();

    if(passThru){
        clearInterval(opacityInterval);
        opacityInterval = setInterval(function(){
            var delta = Date.now() - platAlphaTimer;
            if(delta / 1000 > 0.5){
                platAlpha += platAlphaVel;
                if(platAlpha >= 0.4){
                    platAlphaTimer = Date.now();
                    platAlpha = 0.4;
                }
                if(platAlpha >= 0.4 || platAlpha <= 0.1)
                    platAlphaVel *= -1;
            }
        }, 100);
    }

    let hexString = tempPlat.color.toString(16);
    hexString = hexString.substring(1,7);
    let redString = hexString.substring(0,2);
    let greString = hexString.substring(2,4);
    let bluString = hexString.substring(4,6);
    this.redString = redString;
    this.greenString = greString;
    this.blueString = bluString;
    tempPlat.speed=0;
    tempPlat.maxSpeed=0;
    tempPlat.maxAcceleration=10;
    tempPlat.acceleration=0.1;
    tempPlat.xAcceleration=0;
    tempPlat.yAcceleration=0;
    tempPlat.angularVelocity = 0;
    tempPlat.alpha = 0;
    tempPlat.intertia = 0;//(width * height * (width ** 2 + height ** 2)) / 12;
    tempPlat.elasticity = 0.0000995;
    tempPlat.bottomLift = 0;
    platforms.push(tempPlat);
}

// Triggered whenever player lands on platform
function characterJumpReset(rect){
    if(mode == 0 && rect.character == 1){
        character1.jumpsLeft = 4;
        for(let i = 0; i < character1.limbs.length; i++){
            character1.limbs[i].visible = true;
        }
    }
}

function platformBounceCollision(platform,rect){
    let tempChar = new Character();
    tempChar = Object.assign(tempChar,rect);
    tempChar.y+=rect.bottomLift;
    
    const ovY = getOverlapY(platform,tempChar);
    if(!platform.passThru){
        if(tempChar.y > platform.y){
            const ovX = getOverlapX(platform,tempChar);
            if(ovX >= 0 && ovX < 15){
                if (rect.x-rect.width/2 < platform.x+platform.width/2 || rect.x+rect.width/2 > platform.x-platform.width/2) {
                    rect.velX = -(rect.velX/1.2);
                }
            }
        }
        if(ovY > 0){
            rect.velY = -(rect.velY/1.2);
            
            if(rect.y < platform.y-(platform.height/2) - rect.bottomLift)
                characterJumpReset(rect);
        }
    }
    else{
        if(rect.velY > 0){
            if(ovY > 0 && rect.y < platform.y-(platform.height/2) - rect.bottomLift){
                rect.velY = -(rect.velY/1.2);
                
                characterJumpReset(rect);
            }
        }

    }
} 

// Collision correction with platform when player isn't grabbed
function platformCorrectionVelocity(platform,rect){
    let tempRectY = rect.y;
    let tempChar = new Character();
    tempChar = Object.assign(tempChar,rect);
    tempChar.y+=rect.bottomLift;

    const ovY = getOverlapY(platform,tempChar);
    if(ovY > 0){
        const maxPlatVel = Math.max(platform.velX,platform.velY);
        if(!platform.passThru){
            if (tempChar.y-tempChar.height/2 < platform.y-(platform.height/2) - rect.bottomLift)
                rect.velY-=objectCorrectionCoeff*(maxPlatVel+objectCorrectionCoeff)
            else if(rect.y-rect.height/2 < platform.y+(platform.height/2)){
                if(!rect.touchingGround())
                    rect.velY+=objectCorrectionCoeff*(maxPlatVel+objectCorrectionCoeff)

                const ovX = getOverlapX(platform,rect);
                if( rect.touchingGround() || ovX >= 0 && ovX <= 25){
                    if(tempChar.x < platform.x){
                        rect.x-=objectCorrectionCoeff*(maxPlatVel*2+objectCorrectionCoeff/2);
                        rect.velX-=objectCorrectionCoeff*(maxPlatVel*2+objectCorrectionCoeff/2);
                    }
                    else{
                        rect.x+=objectCorrectionCoeff*(maxPlatVel*2+objectCorrectionCoeff/2);
                        rect.velX+=objectCorrectionCoeff*(maxPlatVel*2+objectCorrectionCoeff/2);
                    }
                }
            }
        }
        else{
            if (tempChar.y-tempChar.height/2 < platform.y-(platform.height/2) - rect.bottomLift)
                rect.velY-=objectCorrectionCoeff*(maxPlatVel+objectCorrectionCoeff)
        }
    }
    if(character1.grabbed && rect.character == 1)
        updateMouseGrab(0,tempRectY-rect.y);
}

// Collision correction with platform when player is grabbed
function platformCorrection(platform,rect){
    let tempRectY = rect.y;
    let tempChar = new Character();
    tempChar = Object.assign(tempChar,rect);
    tempChar.y+=rect.bottomLift;

    const ovY = getOverlapY(platform,tempChar);
    if(ovY > 0){
        if(!platform.passThru){
            if (tempChar.y-tempChar.height/2 < platform.y-(platform.height/2) - rect.bottomLift)
                rect.y = platform.y - (platform.height/2) - rect.bottomLift - (rect.height/2);
            else if(rect.y-rect.height/2 < platform.y+(platform.height/2)){
                if(!rect.touchingGround())
                    rect.y = platform.y + (platform.height/2) + (rect.height/2);

                const ovX = getOverlapX(platform,rect);
                if( rect.touchingGround() || (ovX >= 0 && ovX <= 25)){
                    const maxPlatVel = Math.max(platform.velX,platform.velY);
                    if(tempChar.x < platform.x){
                        rect.x-=objectCorrectionCoeff*(maxPlatVel*2+objectCorrectionCoeff/2);
                        rect.velX-=objectCorrectionCoeff*(maxPlatVel*2+objectCorrectionCoeff/2);
                    }
                    else{
                        rect.x+=objectCorrectionCoeff*(maxPlatVel*2+objectCorrectionCoeff/2);
                        rect.velX+=objectCorrectionCoeff*(maxPlatVel*2+objectCorrectionCoeff/2);
                    }
                }
            }
        }
        else{
            if (tempChar.y-tempChar.height/2 < platform.y-(platform.height/2) - rect.bottomLift)//-tempChar.velY
                rect.y = platform.y - (platform.height/2) - rect.bottomLift - (rect.height/2);
        }
    }
    if(character1.grabbed && rect.character == 1)
        updateMouseGrab(0,tempRectY-rect.y);
}

function platformTicks(){
    for(let i = 0; i < platforms.length; i++){
        platforms[i].tick();
    }
}

function platformVelocityCollision(platform,rect){
    // calculate relative velocity
    const rvx = rect.velX - platform.velX;
    const rvy = rect.velY - platform.velY;

    // calculate normal vector
    let nx = rect.x - platform.x;
    let ny = rect.y - platform.y;
    let length = Math.sqrt(nx * nx + ny * ny);
    nx /= length;
    ny /= length;

    if (rvx * nx + rvy * ny < 0) {
        // calculate the restitution coefficient
        const elast = Math.min(platform.elasticity, rect.elasticity);
        // calculate impulse
        const j =
        -elast *
        (rvx * nx + rvy * ny) /
        (nx * nx + ny * ny) *
        (platform.mass + rect.mass);
        // apply impulse to rectangles
        rect.velX += j * nx / rect.mass;
        rect.velY += j * ny / rect.mass;
        speedLimiter(rect);
    }
}

function platformTorqueCollision(rect1,rect2){
    const ovX = getOverlapX(rect1,rect2);
    const ovY = getOverlapY(rect1,rect2);
    if(ovY <= 0 || ovX <= 0)
        return;

    // calculate collision normal and radius for rect1
    let nx = rect2.x - rect1.x;
    let ny = rect2.y - rect1.y;
    let length = Math.sqrt(nx * nx + ny * ny);
    nx /= length;
    ny /= length;
    let rx1 = -rect1.width/2 * ny;
    let ry1 = rect1.width/2 * nx;

    // calculate collision force for rect1
    const minElast = Math.min(rect1.elasticity,rect2.elasticity);
    let fx1 = -nx * ovX * (minElast);
    let fy1 = -ny * ovY * (minElast);

    // calculate torque for rect1
    let torque1 = rx1 * fy1 - ry1 * fx1;

    // apply force and torque to rect1
    rect1.applyTorqueForce(fx1, fy1, torque1);

    // calculate collision radius and normal for rect2
    let rx2 = rect2.width/2 * ny;
    let ry2 = -rect2.width/2 * nx;
    let fx2 = -fx1;
    let fy2 = -fy1;
    let torque2 = rx2 * fy2 - ry2 * fx2;
    rect2.applyTorqueForce(fx2, fy2, torque2);
}

// All collision logic
function handlePlatformCollision(platform,rect){
    if(rect.velY <=0 && (platform.xTravel != 0 || platform.yTravel != 0)){
        platformTorqueCollision(platform,rect);
        platformVelocityCollision(platform,rect);
        if(!rect.grabbed)
            platformCorrectionVelocity(platform,rect);
    }
    if(!rect.grabbed)
        platformBounceCollision(platform,rect);

    platformCorrection(platform,rect); // only use on seperate entities
}

function platformPhysics(){
    for(let i = 0; i < platforms.length; i++){
        if(checkCharacterCollision(platforms[i],character1) && character1.dead == -1)
            handlePlatformCollision(platforms[i],character1);

        for (let j = 0; j < blocks.length; j++) {
            if(blocks[j].dead != undefined && blocks[j].dead != -1)
                continue;
            if(checkCollision(platforms[i],blocks[j]))
                handlePlatformCollision(platforms[i],blocks[j]);
        }
    }
}

function randomPlatformLayout(){
    let rand = Math.random();

    // Preventing last layout from happening multiple times
    if(rand <= 0.1 && lastPlatformLayout <= 0.1)
        rand = 0.9;
    lastPlatformLayout = rand;

    let randTrans = Math.random() < 0.1;
    let randWidth = Math.random() * 100;
    let randHeight = Math.random() * 5;
    let xDisplacement = Math.random() * 180;
    const uniformity = Math.random() < 0.05;
    if(Math.random() > 0.5)
        xDisplacement *= -1;

    if(uniformity){
        xDisplacement = 0;
        randWidth = 0;
        randHeight = 0;
    }
    if (rand > 0.7){
        // Stationary
        createPlatform((canvas.width/2)+xDisplacement,spawnPlatformY-spawnYOffset,0,0,0,0,0,200-randWidth,10+randHeight,randTrans);
    }
    else if(rand > 0.4){
        // Moves on x axis
        xDisplacement /= 2;
        createPlatform((canvas.width/2)+xDisplacement-(100),spawnPlatformY-spawnYOffset,20,0,200,0,0.01,200-randWidth,10+randHeight,randTrans);
    }
    else if(rand > 0.2){
        // Moves on y axis
        createPlatform((canvas.width/2)+xDisplacement,spawnPlatformY-spawnYOffset,0,20,0,200,0.01,200-randWidth,10+randHeight,randTrans);
    }
    else if(rand > spawnBlockLinePercentage){
        // 2 platforms aligned on y axis moving on y axis
        if(!uniformity){
            xDisplacement = Math.random() * 60;
            if(Math.random() > 0.5)
                xDisplacement *= -1;
            if((canvas.width/2) - 200+xDisplacement -((200-randWidth)/2) < 0) // making sure it's not going past left canvas border
                xDisplacement += (0-((canvas.width/2) - 200+xDisplacement-((200-randWidth)/2)))
            createPlatform((canvas.width/2) - 200+xDisplacement,spawnPlatformY-spawnYOffset,0,10,0,140,0.01,200-randWidth,10+randHeight,randTrans);
            randTrans = Math.random() < 0.1;
            xDisplacement = Math.random() * 60;
            if(Math.random() > 0.5)
                xDisplacement *= -1;
            if((canvas.width/2) + 200+xDisplacement+((200-randWidth)/2) > canvas.width) // making sure it's not going past right canvas border
                xDisplacement -= (((canvas.width/2) + 200+xDisplacement+((200-randWidth)/2)) - canvas.width)
            createPlatform((canvas.width/2) + 200+xDisplacement,spawnPlatformY-spawnYOffset,0,10,0,140,0.01,200-randWidth,10+randHeight,randTrans);
        }
        else{
            createPlatform((canvas.width/2) - 200+xDisplacement,spawnPlatformY-spawnYOffset,0,10,0,140,0.01,200-randWidth,10+randHeight,randTrans);
            createPlatform((canvas.width/2) + 200+xDisplacement,spawnPlatformY-spawnYOffset,0,10,0,140,0.01,200-randWidth,10+randHeight,randTrans);
        }
    }
    else{
        for(let i = 0; i <= canvas.width; i+=30){  
            if(mode == 1 && Math.random() < 0.78)
                continue;
            dropBlocks(i,30,30,-1,-1,200,0.8,false);
        }
    }

    if(rand > spawnBlockLinePercentage && Math.random() <= 0.5*difficultyModifier)
        dropBlocks(-1,-1,-1,-1,-1,-1,-1,-1);
    if(Math.random() <= 0.1*difficultyModifier)
        createBlackHole(-1,-1);
}

// Creates singular block (for falling on player) to push to block array
function dropBlocks(x,width,height,velX,velY,mass,elasticity,spacebound){
    // Setting parameters
    let tempX = x;
    if(x == -1)
        tempX = getRandomIntInclusive(0,canvas.width);
    let tempWidth = width;
    let tempHeight = height;
    if(width == -1)
        tempWidth = tempHeight = getRandomIntInclusive(20,75);
    let tempVelX = velX;
    if(velX == -1)
        tempVelX = getRandomIntInclusive(0,4);
    let tempVelY = velY;
    if(velY == -1)
        tempVelY = getRandomIntInclusive(0,10);
    let tempMass = mass;
    if(mass == -1)
        tempMass = getRandomIntInclusive(100,200);
    let tempElasticity = elasticity;
    if(elasticity == -1)
        tempElasticity = getRandomIntInclusive(4,9)/10;
    let tempSpacebound = spacebound;
    if(spacebound == -1)
        tempSpacebound = Math.random() <= 0.1;

    // Creating object
    const rectTemp = new Rectangle();
    rectTemp.x = tempX;
    rectTemp.y = spawnPlatformY-(canvas.height/2)-200;
    rectTemp.width = tempWidth;
    rectTemp.height = tempHeight;
    rectTemp.velX = tempVelX;
    rectTemp.velY = tempVelY;
    rectTemp.color = "#2dc3ff";
    rectTemp.mass=tempMass;
    rectTemp.speed=10;
    rectTemp.maxSpeed=12;
    rectTemp.maxAcceleration=20;
    rectTemp.acceleration=0.8;
    rectTemp.secondAcceleration=0.02;
    rectTemp.xAcceleration=0;
    rectTemp.yAcceleration=0;
    rectTemp.angularVelocity = 0;
    rectTemp.alpha = 0;
    rectTemp.angle = 0;
    rectTemp.intertia = (this.width * this.height * (this.width ** 2 + this.height ** 2)) * this.mass / 2;
    rectTemp.elasticity = tempElasticity;
    rectTemp.spacebound = tempSpacebound;
    rectTemp.createVertices();
    if(blocks.length > 40)
        blocks.splice(0,1);
    blocks.push(rectTemp);
}

function spawnPlatforms(){
    if(character1.y <= spawnPlatformY){
        randomPlatformLayout();
        createStarsGame(spawnPlatformY-canvas.height);
        
        spawnYOffset -= 10;
        spawnYOffset = clamp(spawnYOffset,(canvas.height/2)+10,400);
        spawnPlatformY-=spawnYOffset;
    }
}

function resetPlatforms(){
    platforms = [];
    spawnYOffset = (canvas.height/2)+10;
    spawnPlatformY = 0;
    lastPlatformLayout = -1;
    clearInterval(opacityInterval);
}