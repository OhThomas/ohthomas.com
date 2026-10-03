let character1;
let waveInterval;
let waveCount = 0;
let waveActivation = 0;
const maxMouseVelocity = 50;
const trajectoryFXVelocityFactor = 5/3;

function createPlayer(){
    character1 = new Character();
    character1.initiate();
    character1.x=canvas.width/2;
    character1.y=canvas.height/2;
    character1.velX=0;
    character1.velY=0;
    character1.width=40;
    character1.height=40;
    character1.color="#0000FF";
    character1.speed=10;
    character1.maxSpeed=12;
    character1.maxAcceleration=20;
    character1.acceleration=0.8;
    character1.secondAcceleration=0.02;
    character1.xAcceleration=0;
    character1.yAcceleration=0;
    character1.mass=50;
    character1.angularVelocity = 0;
    character1.alpha = 0;
    character1.intertia = (this.width * this.height * (this.width ** 2 + this.height ** 2)) / 12;
    character1.elasticity = 0.2;
    character1.angle = 0;
    character1.rotationLock = false;
    character1.getUp = false;
    character1.zIndex=4;
    character1.lastX = canvas.width/2;
    character1.lastY = canvas.height/2;
    character1.trajectoryFXVel = 0;
    character1.jumpsLeft = -1;
    character1.character = 1;
    character1.spacebound = false;
    character1.createVertices();
    character1.createLimbs();
    character1.bottomLift = bottomLiftCoeff;
}

class Limbs {
    constructor(limbNumber,x,y,velX,velY,width,height,parentWidth,parentHeight,color,speed,acceleration){
        this.limbNumber = limbNumber;
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.width = width;
        this.height = height;
        this.parentWidth = parentWidth;
        this.parentHeight = parentHeight;
        this.color = color;
        this.speed = speed;
        this.acceleration = acceleration;
        this.destX = x;
        this.destY = y;
        this.seperation = 3;            // seperates limbs from target location
        this.waveCount = 0;
        this.angle = 0;
        this.visible = true;            // whenever jump occurs, a limb dissapears
        if(limbNumber < 2){
            this.xDisplacement = x-(x+10-(this.limbNumber*(this.width+10)));
            this.yDisplacement = y-(y+parentHeight-15);
        }
        else{
            this.xDispalcement = x-(x-30+((limbNumber-2)*(parentWidth+width+10)));
            this.yDisplacement = y-(y+parentHeight-32);
        }
    }

    waveCounterFunction(){
        if(this.waveCount == 6){
            waveCount = 0;
            this.waveCount = 0;
            clearInterval(waveInterval);
            return;
        }
        else if(this.waveCount % 2 == 0)
            this.destX += 20;
        else
            this.destX -= 20;
        this.waveCount++;
    }

    wave(xDestination, yDestination){
        const delta = Date.now() - waveActivation; // milliseconds elapsed since start
        if(Math.floor(delta / 1000) > 10){
            xDestination += this.parentWidth /2;
            yDestination -= 35;
            this.destX = xDestination;
            this.destY = yDestination;
            this.waveCount = 1;
            waveCount = 1;
            clearInterval(waveInterval);
            this.waveCounterFunction = this.waveCounterFunction.bind(this);
            waveInterval = setInterval(this.waveCounterFunction, 300);
            waveActivation = Date.now() + (1000*500);// 500 seconds until next wave (keep it different so 1st wave can happen sooner)
        }
    }
    
    wallCorrectionLimbs(){
        if(this.x-this.width/2 < 0)
            this.x = 0+this.width/2;
        else if(this.x+this.width/2 > canvas.width)
            this.x = canvas.width - this.width/2;
        if(this.y+this.height/2 > canvas.height)
            this.y = canvas.height - this.height/2;
    }
    
    wallBounceCollisionLimbs(){
        if (this.x-this.width/2 < 0 || this.x+this.width/2 > canvas.width) 
            this.velX = -(this.velX/1.2);
        if (this.y+this.height/2 > canvas.height) 
            this.velY = -(this.velY/1.2);
    }
    
    // Moves limbs to target location
    destination(){
        if(this.destX < this.x-this.seperation){
            if (this.velX > -1 * this.speed)
                this.velX -= this.acceleration;
        }
        else if(this.destX > this.x+this.seperation){
            if (this.velY < this.speed)
                this.velX += this.acceleration;
        }
        if(this.destY < this.y-this.seperation){
            if (this.velY > -1 * this.speed)
                this.velY -= this.acceleration;
        }
        else if(this.destY > this.y+this.seperation){
            if (this.velY < this.speed)
                this.velY += this.acceleration;
        }
    }
    
    tick(x,y,velX,velY,grabbed){
        this.wallBounceCollisionLimbs();
        this.wallCorrectionLimbs();
        this.destination();
        this.angle = -(Math.atan2(velY-2, velX));  // velY-2 to counteract gravity
        
        if(grabbed){
            if(this.waveCount != 0){
                this.waveCount = 0;
                clearInterval(waveInterval);
            }
            let tempVelX = this.velX*2.2;
            let tempVelY = this.velY*2.2;
            tempVelX = clamp(tempVelX,-15,15);
            tempVelY = clamp(tempVelY,-15,15);
            this.x += tempVelX;
            this.y += tempVelY;
            this.destX = mouseXGame;
            this.destY = mouseYGame;
            friction(this,0.96);
            return;
        }
        if(this.waveCount == 0){
            this.destX = x;
            this.destY = y;
        }

        this.x += this.velX+(velX/2);
        this.y += this.velY+(velY/2);
        friction(this,frictionCoeff);
    }
    
    render(velX,velY){
        if(!this.visible)
            return;
        context.save();
        context.translate(this.x-camera.x, this.y-camera.y);
        if(!this.rotationLock)
            context.rotate(this.angle);
        context.fillRect((-this.width/2),(-this.height/2), this.width, this.height);
        context.restore();
    }
    
    letGo(firstMouseX,firstMouseY){
        let xDiff = firstMouseX - mouseXGame;
        let yDiff = firstMouseY - mouseYGame;
        
        xDiff *= 0.14;
        yDiff *= 0.14;

        xDiff = clamp(xDiff,-40,40);
        yDiff = clamp(yDiff,-40,40);

        this.velX = xDiff;
        this.velY = yDiff;
    }
}

// Class used for player, platform, and mouse (should just be player)
class Character extends Rectangle {
    constructor(x,y,velX,velY,width,height,color,speed,maxSpeed,maxAcceleration,acceleration,secondAcceleration,
    xAcceleration,yAcceleration,mass,angularVelocity,alpha,inertia,elasticity,angle,health,damage,zIndex){
        super(x,y,velX,velY,width,height,color,speed,maxSpeed,maxAcceleration,acceleration,secondAcceleration,xAcceleration,yAcceleration,
        mass,angularVelocity,alpha,inertia,elasticity,angle,zIndex);
        this.health = health;
        this.damage = damage;
        this.trajectoryFXVel = 0;
        this.collisionFX = [];
        this.deadPoint = new Vector(0,0);
    }
    
    collisionFX(x,y,impact){
        //if impact > whatever then create more
        let fx = new Rectangle();
        // this.collisionFX 
    }

    wave(){
        if(this.limbs != undefined && this.limbs.length != 0){
            for(let i = 2; i < this.limbs.length; i++){
                if(i == 2 && randomIntFromInterval(0,2) == 0){
                    this.limbs[i].wave(-20+(this.x-30+((i-2)*(this.width+this.limbs[i].width+10))),
                    (this.y+this.height-32));   //left arm
                    return;
                }
                else
                    this.limbs[i].wave(20+(this.x-30+((i-2)*(this.width+this.limbs[i].width+10))),
                    (this.y+this.height-32));   //right arm
            }
        }
    }

    // Limb logic for lava
    limbsMelt(){
        const velX = 0.7*(lavaSinWaveOffsetVel*100);
        const velY = 0.007;
        const rand = Math.random()*10;
        for(let i = 0; i < this.limbs.length; i++){
            if(this.limbs[i].width > 0)
                this.limbs[i].width -=0.01;
            if(this.limbs[i].height > 0)
                this.limbs[i].height -=0.01;
            this.limbs[i].tick(this.x+((i-rand)*10),this.y+40,velX,velY,this.grabbed);
        }
    }

    // Limb logic for black hole
    warpLimbsToPoint(point){
        const radians = Math.atan2(this.y-point.y, this.x-point.x);
        const angle = radians * 180 / Math.PI;
        const strength = 0; // go negative
        const distance = Math.sqrt(((this.x-point.x) ** 2) + ((this.y-point.y) ** 2));
        const velXTemp = ((strength+distance)/100)*(Math.cos(angle));
        const velYTemp = ((strength+distance)/100)*(Math.sin(angle));
        for(let i = 0; i < this.limbs.length; i++)
            this.limbs[i].tick(point.x,point.y,velXTemp,velYTemp,this.grabbed);
    }
    
    tick(){
        if(!gameOver){
            super.tick();

            if(this.character == 1 && this.dead != -1){
                gameOverFunc();
            }
        }
        else{
            if(this.character == 1){
                if(this.dead == 1)
                    super.tick();
                else if(this.dead == 2){
                    for(let i = 0; i < blackHoles.length; i++){
                        if(checkCollision(this,blackHoles[i].innerBlackHole)){
                            this.warpVerticesToPoint(blackHoles[i].innerBlackHole);
                            this.deadPoint = new Vector(blackHoles[i].innerBlackHole.x,blackHoles[i].innerBlackHole.y);
                        }
                    }
                }
            }
        }
        
        if(this.limbs != undefined && this.limbs.length != 0){
            if(this.dead == 1)
                this.limbsMelt();
            else if(this.dead == 2)
                this.warpLimbsToPoint(this.deadPoint)
            else{
                for(let i = 0; i < 2; i++){
                    this.limbs[i].tick(this.x+10-(i*(this.limbs[i].width+10)),this.y+this.height-15,this.velX,this.velY,this.grabbed);//legs
                }
                for(let i = 2; i < this.limbs.length; i++){
                    this.limbs[i].tick(this.x-30+((i-2)*(this.width+this.limbs[i].width+10)),this.y+this.height-32,this.velX,this.velY,this.grabbed);//arms
                }
            }
        }

        if(waveCount == 0 && this.grabbed == false && !gameOver && this.touchingGround() && randomIntFromInterval(0,100) == 0)
            this.wave();
    }
    
    render(){
        if(!gameOver)
            super.render();
        else
            this.verticesRender();

        const tempFill = context.fillStyle;
        context.fillStyle = this.color;
        
        if(this.limbs != undefined && this.limbs.length != 0){
            for(let i = 0; i < this.limbs.length; i++){
                this.limbs[i].render(this.x,this.y,this.velX,this.velY);
            }
        }

        context.fillStyle = tempFill;
    }

    createLimbs(){
        this.limbs = [
            new Limbs(0,this.x-40,this.y-40,0,0,this.width/4,this.height/4,this.width,this.height,this.color,10,0.96),
            new Limbs(1,this.x-40,this.y-40,0,0,this.width/4,this.height/4,this.width,this.height,this.color,10,0.96),
            new Limbs(2,this.x-40,this.y-40,0,0,this.width/4,this.height/4,this.width,this.height,this.color,10,0.96),
            new Limbs(3,this.x-40,this.y-40,0,0,this.width/4,this.height/4,this.width,this.height,this.color,10,0.96),
        ];
    }

    // Logic for hiding limbs when jump depleted
    hideLimbHelper(start){
        if(start > 3)
            start = 0;
        if(this.limbs[start].visible)
            this.limbs[start].visible = false;
        else{
            let startProgresser = start+1;
            this.hideLimbHelper(startProgresser);
        }
    }

    hideLimb(){
        if(!this.limbs[0].visible && !this.limbs[1].visible && 
            !this.limbs[2].visible && !this.limbs[3].visible)
            return;
        const rand = Math.random();
        if(rand > 0.75){
            this.hideLimbHelper(0);
        }
        else if(rand > 0.5){
            this.hideLimbHelper(1);
        }
        else if(rand > 0.25){
            this.hideLimbHelper(2);
        }
        else{
            this.hideLimbHelper(3);
        }
    }

    addVelocity(){
        if(this.character == 1 && (this.velY > constantCollisionHeight || this.velY < -constantCollisionHeight)){ // 10 is the smallest height of another object (platform object)
            this.constantCollisionDetection();
        }
        else
            this.y+=this.velY;
        this.x+=this.velX;
    }
    
    // Changes angle based on user input location
    grabbingRotation(){
        const xDiff = mouseXGame-this.firstMouseX;
        const yDiff = mouseYGame-this.firstMouseY;
        this.rotationX = xDiff;
        this.rotationY = yDiff;
        this.velX = xDiff / 4;
        this.velY = yDiff / 4;
        this.velX = clamp(this.velX,-maxMouseVelocity,maxMouseVelocity);
        this.velY = clamp(this.velY,-maxMouseVelocity,maxMouseVelocity);
        const maxVel = Math.max(Math.abs(this.velX),Math.abs(this.velY));
        this.trajectoryFXVel = maxVel/trajectoryFXVelocityFactor;
    }
    
    grab(x,y){
        if(gameOver || this.character == undefined || (mode == 0 && this.jumpsLeft <= 0))
            return;
        this.mouseOffsetX = this.x-x;
        this.mouseOffsetY = this.y-y;
        this.angleAcceleration = 0;
        this.grabbed = true;
        if(this.touchingGround())
            this.angle = 0;
        this.currentAngle = this.angle;

        this.firstMouseX = mouseXGame;//centerOfMass.x;
        this.firstMouseY = mouseYGame;//centerOfMass.y;
        this.mouseXVel = 0;
        this.mouseYVel = 0;
        this.trajectoryFXVel = 0;
        waveCount = 0;
        clearInterval(waveInterval);
    }
    
    letGo(){
        if(gameOver || this.character == undefined )
            return;
        if(this.grabbed){
            if(mode == 0 && character1.jumpsLeft > 0){
                character1.jumpsLeft--;
                this.hideLimb();
            }

            if(this.limbs != undefined && this.limbs.length != 0){
                for(let i = 0; i < this.limbs.length; i++){
                    this.limbs[i].letGo(this.firstMouseX,this.firstMouseY);
                }
            }
            let dx = this.velX;
            let dy = this.velY;
            this.position = new Vector(this.x,this.y);
            this.velocity = new Vector(dx,dy);
            this.velX = -dx;
            this.velY = -dy;
            if(dx == 0 && dy == 0){
                this.velX = -1*(Math.cos(-this.angle));
                this.velY = -1*(Math.sin(-this.angle));
            }
            this.grabbed = false;
        }
        this.angleAcceleration = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.mouseXVel = 0;
        this.mouseYVel = 0;
    }
}

function checkCharacterCollision(rect1, rect2) {
    let tempChar = new Character();
    tempChar = Object.assign(tempChar,rect2);
    let bottomLift = Math.max(rect1.bottomLift,rect2.bottomLift);
    tempChar.y+=bottomLift;

    // get the edges and vertices of both rectangles
    const edges1 = rect1.getEdges();
    const vertices1 = rect1.getVertices();
    const edges2 = tempChar.getEdges();
    const vertices2 = tempChar.getVertices();

    // define variables to store minimum and maximum projections
    let minOverlap = Infinity;
    let axisWithMinOverlap = null;

    // loop through all the edges of both rectangles
    for (let edges of [edges1, edges2]) {
        for (let edge of edges) {
            // get the axis perpendicular to the edge
            const axis = edge.normal();

            // project vertices of both rectangles onto the axis
            const projections1 = vertices1.map(v => v.dot(axis));
            const projections2 = vertices2.map(v => v.dot(axis));

            // calculate the minimum and maximum projections for both rectangles
            const min1 = Math.min(...projections1);
            const max1 = Math.max(...projections1);
            const min2 = Math.min(...projections2);
            const max2 = Math.max(...projections2);

            // calculate the overlap between the projections
            const overlap = Math.min(max1, max2) - Math.max(min1, min2);

            // if there is no overlap, the rectangles do not collide, return false
            if (overlap < 0) {
                return false;
            }

            // if there is overlap, check if it is the minimum overlap so far
            if (overlap < minOverlap) {
                minOverlap = overlap;
                axisWithMinOverlap = axis;
            }
        }
    }
    if(axisWithMinOverlap == null || axisWithMinOverlap == undefined ||
        rect1.velocity == null || rect1.velocity == undefined || 
        rect2.velocity == null || rect2.velocity == undefined)
        return true;
    return true;
}