let character1;
let character2;
let waveInterval;
let waveCount = 0;
let waveActivation = 0;

function createPlayers(){
    character1 = new Character();
    character1.x=100;
    character1.y=canvas.height/2;
    character1.velX=0;
    character1.velY=0;
    character1.width=50;
    character1.height=50;
    character1.color='red';
    character1.speed=8;
    character1.maxSpeed=10;
    character1.maxAcceleration=20;;
    character1.acceleration=0.4;
    character1.secondAcceleration=0.04;
    character1.xAcceleration=0;
    character1.yAcceleration=0;
    character1.mass=100;//2000;
    character1.angularVelocity = 0;
    character1.alpha = 0;
    character1.inertia = (this.width * this.height * (this.width ** 2 + this.height ** 2)) / 12;
    character1.elasticity = 0.5;
    character1.angle = 0;
    character1.health=100;
    character1.damage=10;
    character1.rotationLock = false;
    character1.zIndex=4;
    character1.createVertices();
    
    character2 = new Character();
    character2.x=400;
    character2.y=canvas.height/2;
    character2.velX=0;
    character2.velY=0;
    character2.width=40;
    character2.height=40;
    character2.color='blue';
    character2.speed=10;
    character2.maxSpeed=12;
    character2.maxAcceleration=20;//2;
    character2.acceleration=0.8;
    character2.secondAcceleration=0.02;
    character2.xAcceleration=0;
    character2.yAcceleration=0;
    character2.mass=50;//1000;
    character2.angularVelocity = 0;
    character2.alpha = 0;
    character2.intertia = (this.width * this.height * (this.width ** 2 + this.height ** 2)) / 12;
    character2.elasticity = 0.2;
    character2.angle = 0;
    character2.health=100;
    character2.damage=10;
    character2.rotationLock = false;
    character2.zIndex=4;
    character2.createVertices();
    character2.createLimbs();
    
    entities.push(character1);
    entities.push(character2);
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
        this.seperation = 3;
        this.waveCount = 0;
        if(limbNumber < 2){
            this.xDisplacement = x-(x+10-(this.limbNumber*(this.width+10)));
            this.yDisplacement = y-(y+parentHeight-15);
        }
        else{
            this.xDispalcement = x-(x-30+((limbNumber-2)*(parentWidth+width+10)));
            this.yDisplacement = y-(y+parentHeight-32);
        }
        // this.waveActivation = Date.now();
        // this.waveInterval;
        // this.waveCount = 0;

        // this.x+10-(i*(this.limbs[i].width+10)),this.y+this.height-15
        // this.limbs[i].tick(this.x-30+((i-2)*(this.width+this.limbs[i].width+10)),this.y+this.height-32,this.velX,this.velY,this.grabbed);//arms
    }

    waveCounterFunction(){
        console.log("IN HEREFIRSTONE wavecount = "+this.waveCount + " destx = "+this.destX);
    
        if(this.waveCount == 6){
            waveCount = 0;
            this.waveCount = 0;
            clearInterval(waveInterval);
            return;
        }
        else if(this.waveCount % 2 == 0){
            // entities[1].limbs[2].destX += 500;
            // destX += 500;
            this.destX += 20;
            // console.log("IN HERE waveActivation = "+waveActivation +" this x = "+this.x+" destX = "+destX + " xDestination = "+xDestination);
    
        }
        else{
            // entities[1].limbs[2].destX -= 1000;
            // destX -= 1000;
            this.destX -= 20;
        }
        this.waveCount++;

    }

    wave(xDestination, yDestination){
        const delta = Date.now() - waveActivation; // milliseconds elapsed since start
        if(Math.floor(delta / 1000) > 10){
            xDestination += this.parentWidth /2;
            yDestination -= 35;
            this.destX = xDestination;
            this.destY = yDestination;
            console.log("waveActivation = "+waveActivation +" this x = "+this.x+" destX = "+this.destX + " xDestination = "+xDestination);
            this.waveCount = 1;//0;
            waveCount = 1;
            clearInterval(waveInterval);
            this.waveCounterFunction = this.waveCounterFunction.bind(this);
            waveInterval = setInterval(this.waveCounterFunction, 300);//,this.waveCount,this.destX);
            waveActivation = Date.now() + (1000*500);// 500 seconds until next wave (keep it different so 1st wave can happen sooner)
        }
        // this.waveActivation = Date.now();
    }
    
    wallCorrectionLimbs(){
        if(this.x-this.width/2 < 0)
            this.x = 0+this.width/2;
        else if(this.x+this.width/2 > canvas.width)
            this.x = canvas.width - this.width/2;
        if(this.y-this.height/2 < 0)
            this.y = 0+this.height/2;
        else if(this.y+this.height/2 > canvas.height)
            this.y = canvas.height - this.height/2;
    }
    
    wallBounceCollisionLimbs(){
        // if (this.x < 0 || this.x + this.width > canvas.width) {
        if (this.x-this.width/2 < 0 || this.x+this.width/2 > canvas.width) {
            this.velX = -(this.velX/1.2);
        }
        // if (this.y < 0 || this.y + this.height > canvas.height) {
        if (this.y-this.height/2 < 0 || this.y+this.height > canvas.height) {
            this.velY = -(this.velY/1.2);
        }
    }
    
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
        
        if(grabbed){
            if(this.waveCount != 0){
                this.waveCount = 0;
                clearInterval(waveInterval);
            }
            // this.x = x-this.xDisplacement;
            // this.y = y-this.yDisplacement;
            this.x += this.velX+(velX/1.2);
            this.y += this.velY+(velY/1.2);
            this.destX = x;
            this.destY = y;
            return;
        }
        if(this.waveCount == 0){
            this.destX = x;
            this.destY = y;
        }

        this.x += this.velX+(velX/2);
        this.y += this.velY+(velY/2);
        friction(this);
        // console.log("x = "+this.x+" y = "+this.y+" destx = "+this.destX+" param y = "+y);
    }
    
    render(velX,velY){
        // const angle = Math.atan2(velY, velX);
        const angle = -(Math.atan2(velY-2, velX));  // velY-2 to counteract gravity
        context.save();
        context.translate(this.x, this.y);
        if(!this.rotationLock)
            // context.rotate(Math.atan2(this.velY, this.velX));
            context.rotate(angle);
        // context.fillRect(-this.width/2-(this.width/6), -this.height/2+(this.height/3)+(this.height/12), this.width/6, this.height/6);//leftarm
        // context.fillRect(this.width/2, -this.height/2+(this.height/3)+(this.height/12), this.width/6, this.height/6);//rightarm
        // context.fillRect(-this.width/2+(this.width/3)-(this.width/6), this.height/2, this.width/6, this.height/6);//leftleg
        // context.fillRect(this.width/2-(this.width/3), this.height/2, this.width/6, this.height/6);//rightleg
        
        // context.fillRect(-this.width/2,-this.height/2, this.width, this.height);
        context.fillRect(-this.width/2,-this.height/2, this.width, this.height);
        context.restore();
    }
    
}

class Rectangle {
    constructor(x,y,velX,velY,width,height,color,speed,maxSpeed,maxAcceleration,acceleration,secondAcceleration,
    xAcceleration,yAcceleration,mass,angularVelocity,alpha,inertia,elasticity,angle,zIndex){
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.maxSpeed = maxSpeed;
        this.maxAcceleration = maxAcceleration;
        this.acceleration = acceleration;
        this.secondAcceleration = secondAcceleration;
        this.xAcceleration = xAcceleration;
        this.yAcceleration = yAcceleration;
        this.mass = mass;
        this.angularVelocity = angularVelocity;
        this.alpha = alpha;
        this.inertia = inertia;
        this.elasticity = elasticity;
        this.angle = angle;
        this.zIndex = zIndex;
        this.velocity = new Vector(0,0);
        this.grabbed = false;
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;
        this.angleAcceleration = 0;
        
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
    // constructor(x,y,velX,velY,width,height,color,speed,maxSpeed,maxAcceleration,acceleration,secondAcceleration,
    // xAcceleration,yAcceleration,mass,angularVelocity,alpha,inertia,elasticity,angle,health,damage,zIndex){
        // this.x = x;
        // this.y = y;
        // this.velX = velX;
        // this.velY = velY;
        // this.width = width;
        // this.height = height;
        // this.color = color;
        // this.speed = speed;
        // this.maxSpeed = maxSpeed;
        // this.maxAcceleration = maxAcceleration;
        // this.acceleration = acceleration;
        // this.secondAcceleration = secondAcceleration;
        // this.xAcceleration = xAcceleration;
        // this.yAcceleration = yAcceleration;
        // this.mass = mass;
        // this.angularVelocity = angularVelocity;
        // this.alpha = alpha;
        // this.inertia = inertia;
        // this.elasticity = elasticity;
        // this.angle = angle;
        // this.health = health;
        // this.damage = damage;
        // this.zIndex = zIndex;
        
        // this.vertices = [
            // //new Vector(-this.width/2, -this.height/2),
            // //new Vector(this.width/2, -this.height/2),
            // //new Vector(this.width/2, this.height/2),
            // //new Vector(-this.width/2, this.height/2)
            // new Vector(-width/2, -height/2),
            // new Vector(width/2, -height/2),
            // new Vector(width/2, height/2),
            // new Vector(-width/2, height/2)
        // ];

        ////Rotate the vertices by the initial angle...
        // for (let i = 0; i < this.vertices.length; i++) {
            // this.vertices[i].rotate(this.angle);
        // }
    // }
    
    applyForce(fx, fy) {
        this.xAcceleration += fx*10 / this.mass;
        this.yAcceleration += fy*10 / this.mass;
        // this.velX += fx / this.mass;
        // this.velY += fy / this.mass;
    }

    applyTorqueForce(fx, fy, torque) {
        let ax = fx / this.mass;
        let ay = fy / this.mass;
        this.inertia = this.mass * this.width * this.height / 12;
        let alpha = torque / this.inertia;
        if(isNaN(alpha))
            return;
        this.alpha = alpha;
        this.velX += ax;
        this.velY += ay;
        this.angularVelocity += alpha;
    }
    
    applyGravity(gravity) {
        this.applyForce(0,gravity);
        // calculate weight of rectangle
        const weight = this.width * this.height * this.mass * gravity;

        // calculate torque
        const distance = Math.sqrt((this.width / 2) ** 2 + (this.height / 2) ** 2);
        const torque = weight * distance * Math.sin(this.angle);

        // calculate angular acceleration
        const angularAcceleration = torque / this.inertia;

        // update angle using numerical integration
        const deltaT = 1 / 60; // assume 60 fps
        this.angle += this.angularVelocity * deltaT + 0.5 * angularAcceleration * deltaT ** 2;
        this.angularVelocity += angularAcceleration * deltaT;
    }
    
    grabbingRotation(){
        const centerOfMass = centerOfMassRect(this);
        // console.log("x = "+this.x+" mouseX = "+mouseX + " com = "+centerOfMass.x);
        // console.log("y = "+this.y+" mouseY = "+mouseY + " com = "+centerOfMass.y);
        /*
        if(centerOfMass.y < mouseY){
            // console.log("centerOfMass.y < mouseY angleaceel = "+this.angleAcceleration);
                this.angleAcceleration += 0.001;
            if(centerOfMass.x < mouseX){
            // console.log("centerOfMass.x < mouseX");
                // this.angleAcceleration += 0.001;
                this.xAcceleration += this.angleAcceleration;
                this.angle += this.angleAcceleration;
            }
            else{
                // this.angleAcceleration -= 0.001;
                this.xAcceleration -= this.angleAcceleration;
                this.angle +=this.angleAcceleration;
            }
        }
        else if(centerOfMass.x < mouseX){
                this.angleAcceleration -= 0.001;
                // this.angleAcceleration += 0.001;
            this.xAcceleration += this.angleAcceleration;
            this.angle +=this.angleAcceleration;
        }
        else{
                this.angleAcceleration += 0.001;
            this.xAcceleration += this.angleAcceleration;
            this.angle +=this.angleAcceleration;
        }*/
        if(centerOfMass.x < mouseX){
            // console.log("centerOfMass.y < mouseY angleaceel = "+this.angleAcceleration);
                this.angleAcceleration -= 0.001;
            if(centerOfMass.y < mouseY){
            // console.log("centerOfMass.x < mouseX");
                // this.angleAcceleration += 0.001;
                this.xAcceleration += this.angleAcceleration;
                this.angle += this.angleAcceleration;
            }
            else{
                // this.angleAcceleration -= 0.001;
                // this.xAcceleration -= this.angleAcceleration;
                this.xAcceleration -= this.angleAcceleration;
                this.angle +=this.angleAcceleration;
            }
        }
        else if(centerOfMass.y < mouseY){
                this.angleAcceleration += 0.001;
                // this.angleAcceleration += 0.001;
            this.xAcceleration += this.angleAcceleration;
            this.angle +=this.angleAcceleration;
        }
        else{
                this.angleAcceleration += 0.001;
            this.xAcceleration += this.angleAcceleration;
            this.angle +=this.angleAcceleration;
        }
        if(this.angleAcceleration < 0)
            this.angleAcceleration += 0.0001;
        else if(this.angleAcceleration > 0)
            this.angleAcceleration -= 0.0001;
        
        
        
        if(this.angle > this.currentAngle + 3.14 )
            this.angleAcceleration += ((this.angleAcceleration *= -1)/100);
        else if(this.angle< this.currentAngle - 3.14 )
            this.angleAcceleration += ((this.angleAcceleration *= -1)/100);
        // if(this.angleAcceleration > 0.1)
            // this.angleAcceleration = 0.1;
        // else if(this.angleAcceleration < -0.1)
            // this.angleAcceleration = -0.1;
    }
    
    tick(){//dt){
        
        if(this.grabbed){
            //follow mouse velocity function
            // this.velX = 0.01 * mouseX;
            // this.velY = 0.01 * mouseY;
            this.grabbingRotation();
            // this.position = new Vector(this.x,this.y);
            // this.velocity = new Vector(this.velX,this.velY);
            
        // this.velX += this.xAcceleration;
        // this.velY += this.yAcceleration;
        // this.x+=this.velX;
        // this.y+=this.velY;
            this.x = mouseX+this.mouseOffsetX;
            this.y = mouseY+this.mouseOffsetY;
            this.mouseXVel += ((this.mouseXVel *= -1)/4);
            this.mouseYVel += ((this.mouseYVel *= -1)/4);
            this.mouseXVel += this.lastMouseX - mouseX;
            this.mouseYVel += this.lastMouseY - mouseY;
            this.lastMouseX = mouseX;
            this.lastMouseY = mouseY;
            
            // if(!this.rotationLock)
                // this.angle = Math.atan2(this.velY, this.velX);
            
            
            // this.angularVelocity += this.alpha * this.acceleration/1000;//dt;
            // this.angle += this.angularVelocity; //* this.acceleration;//dt;
            
            return;
        }
        
        
        this.applyForce(0,2);
        /*
        // this.x += this.velX * acceleration;
        // this.y += this.velY * acceleration;
        this.angularVelocity *= 1 - 0.1 * this.acceleration; // apply rotational damping
        this.angularVelocity += this.gravity * this.acceleration; // apply gravity
        let angle = Math.atan2(this.height, this.width);
        let velocityMagnitude = Math.sqrt(this.velX ** 2 + this.velY ** 2);
        let velocityAngle = Math.atan2(this.velY, this.velX);
        let angularVelocityVector = angleToVector(angle + Math.PI / 2, this.angularVelocity);
        let velocityVector = angleToVector(velocityAngle, velocityMagnitude);
        let resultVector = addVectors(angularVelocityVector, velocityVector);
        this.velX = resultVector.x;
        this.velY = resultVector.y;*/
        
        // if(isNaN(this.acceleration))
            // this.acceleration = 0;
        // if(isNaN(this.alpha))
            // this.alpha = 0;
        // if(isNaN(this.angularVelocity))
            // this.angularVelocity = 0;
        // if(isNaN(this.angle))
            // this.angle=0;
        
        
        // console.log(this.yAcceleration + " vely = "+this.velY);
        this.velX += this.xAcceleration;
        this.velY += this.yAcceleration;
        
        this.position = new Vector(this.x,this.y);
        this.velocity = new Vector(this.velX,this.velY);
        
        // this.angularVelocity += this.alpha * this.acceleration/1000;//dt;
        // this.angle += this.angularVelocity; //* this.acceleration;//dt;
        
        // This will have the orientation always change
        if(!this.rotationLock){
            if(!this.touchingGround())
                this.angle = Math.atan2(this.velY-2, this.velX);
            else
                this.angle = -(Math.atan2(this.velY-2, this.velX));
        }
            // this.angle = -(Math.atan2(this.velY-2, this.velX));
            // this.angle = Math.atan2(this.velY, this.velX);
        
        friction(this);
        
        this.x+=this.velX;
        this.y+=this.velY;
        
        // console.log("velX = "+this.velX+" "+this.velY+" "+this.y);
        // if(this.velX == 0 && this.velY < 0.2 && this.y > 320){
        // console.log("angle = "+this.angle);
            // this.angle = 0;
        // }
        // if(this.angle > 3.14)
            // this.angle -= 3.14;
        // else if(this.angle < -3.14)
            // this.angle +=3.14;
        
        // Rotate the vertices by the angle
        // if(this.angularVelocity != 0)
            // console.log("ANGLE = "+this.angle+" angularvel = "+this.angularVelocity);
        // this.createVertices();
        // for (let i = 0; i < this.vertices.length; i++) {
            // console.log("vertices = "+this.vertices[i].x);
            // this.vertices[i].rotate(this.angle);
        // }
    }
    
    render(){
        context.fillStyle = this.color;
        
        if(this.grabbed){
            const originX = this.x + this.width*mouseX;
            const originY = this.y + this.height*mouseY;
            context.translate(this.x-this.mouseOffsetX, this.y-this.mouseOffsetY);
            context.rotate(this.angle);
            
            context.fillRect(-this.width/2+this.mouseOffsetX, -this.height/2+this.mouseOffsetY, this.width, this.height);
            // cameraFill(-this.width/2+this.mouseOffsetX, -this.height/2+this.mouseOffsetY, this.width, this.height);
            // cameraFill(-this.width/2+this.mouseOffsetX, -this.height/2+this.mouseOffsetY, this.width, this.height);
            
            context.rotate(-this.angle);
            context.translate(-1* (this.x-this.mouseOffsetX), -1*(this.y-this.mouseOffsetY));
            // context.translate(-originX,-originY);
            return;
        }
        
        // context.fillRect(this.x, this.y, this.width, this.height);
        this.angleTranslate(context);
    }
    
    angleTranslate(){
        context.save();
        context.translate(this.x, this.y);
        if(!this.rotationLock)
            // context.rotate(Math.atan2(this.velY, this.velX));
            context.rotate(this.angle);
        context.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        context.restore();
    }
    
      // Get the edges of the rectangle
    getEdges() {
        const vertices = this.getVertices();
        const edges = [];
        for (let i = 0; i < vertices.length; i++) {
            const j = (i + 1) % vertices.length;
            // const edge = {
                // x: vertices[j].x - vertices[i].x,
                // y: vertices[j].y - vertices[i].y,
            // };
            const edge = new Vector(vertices[j].x - vertices[i].x, vertices[j].y - vertices[i].y);
            edges.push(edge);
        }
        return edges;
    }
    
    createVertices(){
        this.position = new Vector(this.x,this.y);
        this.velocity = new Vector(this.velX,this.velY);
        this.inertia = (this.width * this.height * (this.width ** 2 + this.height ** 2)) / 12;
        this.vertices = [
            new Vector(-this.width/2, -this.height/2),
            new Vector(this.width/2, -this.height/2),
            new Vector(this.width/2, this.height/2),
            new Vector(-this.width/2, this.height/2)
        ];
        this.grabbed = false;
        this.angleAcceleration = 0;
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;
    }
    
    // getVertices() {
        // const angle = this.angle;
        // const cos = Math.cos(angle);
        // const sin = Math.sin(angle);
        // const topLeft = new Vector(-this.width / 2, -this.height / 2);
        // const topRight = new Vector(this.width / 2, -this.height / 2);
        // const bottomLeft = new Vector(-this.width / 2, this.height / 2);
        // const bottomRight = new Vector(this.width / 2, this.height / 2);
        // topLeft.multiply(cos).subtract(topLeft.multiply(sin));
        // topRight.multiply(cos).subtract(topRight.multiply(sin));
        // bottomLeft.multiply(cos).subtract(bottomLeft.multiply(sin));
        // bottomRight.multiply(cos).subtract(bottomRight.multiply(sin));
        // console.log(topLeft.x);
        // if(isNaN(topLeft.x))
            // return;
        // else
            // console.log("WTF");
        // const vertices = [
            // topLeft.add(this.position),
            // topRight.add(this.position),
            // bottomLeft.add(this.position),
            // bottomRight.add(this.position),
        // ];
        // return vertices;
    // }
      // Get the vertices of the rectangle
    getVertices() {
        const sin = Math.sin(this.angle);
        const cos = Math.cos(this.angle);
        const dx = this.width / 2;
        const dy = this.height / 2;
        const x1 = this.x + dx * cos - dy * sin;
        const y1 = this.y + dx * sin + dy * cos;
        const x2 = this.x - dx * cos - dy * sin;
        const y2 = this.y - dx * sin + dy * cos;
        const x3 = this.x - dx * cos + dy * sin;
        const y3 = this.y - dx * sin - dy * cos;
        const x4 = this.x + dx * cos + dy * sin;
        const y4 = this.y + dx * sin - dy * cos;
        return [
            new Vector(x1, y1),
            new Vector(x2, y2),
            new Vector(x3, y3),
            new Vector(x4, y4),
        ];
        this.position = new Vector(this.x,this.y);
    }
  
    translate(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.getVertices();
        // this.vertices.forEach(vertex => {
            // vertex.x += dx;
            // vertex.y += dy;
        // });
    }  
    
    applyImpulse(impulse) {
        // Calculate the change in velocity caused by the impulse
        const dv = impulse.divide(this.mass);

        // Update the velocity
        // this.velocity = this.velocity.add(dv);
        this.velocity = this.velocity.add(dv);
    }
    
    reOrient(){
        this.angularVelocity = 0;
        this.angle = 0;
        this.getVertices();
        // this.render(context);
    }
    
    grab(x,y){
        this.mouseOffsetX = this.x-x;
        this.mouseOffsetY = this.y-y;
        this.angleAcceleration = 0;
        this.grabbed = true;
        if(this.touchingGround()) // - 5
            this.angle = 0;
        this.currentAngle = this.angle;
        this.lastMouseX = mouseX;
        this.lastMouseY = mouseY;
        this.mouseXVel = 0;
        this.mouseYVel = 0;
        waveCount = 0;
        clearInterval(waveInterval);
    }
    
    letGo(){
        if(this.grabbed){
            // const dx = this.lastMouseX - mouseX;
            // const dy = this.lastMouseY - mouseY;
            let dx = this.lastMouseX - mouseX;
            let dy = this.lastMouseY - mouseY;
            this.mouseXVel /= 3.4;
            this.mouseYVel /= 3.4;
            // if((dx < 0 && this.mouseXVel < 0 && this.mouseXVel < dx) ||
            //     (dx > 0 && this.mouseXVel > 0 && this.mouseXVel > dx))
            if(dx == 0 && (this.mouseXVel > 0.1 || this.mouseXVel < -0.1))
                dx = this.mouseXVel;
            // if((dy < 0 && this.mouseYVel < 0 && this.mouseYVel < dy) ||
            //     (dy > 0 && this.mouseYVel > 0 && this.mouseYVel > dy))
            if(dy == 0 && (this.mouseYVel > 0.1 || this.mouseYVel < -0.1))
                dy = this.mouseYVel;
            this.position = new Vector(this.x,this.y);
            this.velocity = new Vector(dx,dy);
            this.velX = -dx;
            this.velY = -dy;
            if(dx == 0 && dy == 0){
                // this.velX=-0.1;
                this.velX = -1*(Math.cos(-this.angle));
                this.velY = -1*(Math.sin(-this.angle));
            }
            // this.applyTorqueForce(this.velX*10,this.velY*10,this.angleAcceleration*100);
            this.grabbed = false;
            console.log("dy = "+dy+" dx = "+dx );
            console.log("mouseXVel = "+this.mouseXVel+" lastMouseX = "+this.lastMouseX+" mouseX = "+mouseX +" angleaccel = "+this.angleAcceleration);
        }
        this.angleAcceleration = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.mouseXVel = 0;
        this.mouseYVel = 0;
    }

    touchingGround(){
        return (this.y > canvas.height - bottomLift - this.height - 1);
    }
}
    
    
// Define the Vector class...
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Calculate the magnitude of the vector
    // getMagnitude() {
        // return Math.sqrt(this.x ** 2 + this.y ** 2);
    // }

    // Add a vector to this vector
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    // Subtract a vector from this vector
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    divide(scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    }

    // Scale this vector by a scalar value
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }  
    
    // Returns the length (magnitude) of the vector
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // getMagnitude() {
        // return Math.sqrt(this.x ** 2 + this.y ** 2);
    // }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    // getNormal() {
        // return new Vector(-this.y, this.x);
    // }
    
    normal() {
        return new Vector(-this.y, this.x);
    }  
    
    // normalize() {
        // const len = this.length();
        // if (len === 0) {
          // return new Vector(0, 0);
        // }
        // return new Vector(this.x / len, this.y / len);
    // }

    // getDotProduct(vector) {
        // return this.x * vector.x + this.y * vector.y;
    // }

    // getAngle() {
        // return Math.atan2(this.y, this.x);
    // }
    
    dot(otherVector) {
        return this.x * otherVector.x + this.y * otherVector.y;
    }

    // static fromAngle(angle, magnitude = 1) {
        // return new Vector(Math.cos(angle) * magnitude, Math.sin(angle) * magnitude);
    // }

    // Rotate this vector by an angle in radians
    rotate(angle) {
        if(angle == null || isNaN(angle))
            return;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        // console.log("cost = "+cos+"angle = "+angle+"current x = "+this.x);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        this.x = x;
        this.y = y;
    }
}

class Projectile extends Rectangle{
    constructor(x,y,velX,velY,width,height,color,speed,maxSpeed,maxAcceleration,acceleration,secondAcceleration,
    xAcceleration,yAcceleration,mass,angularVelocity,alpha,inertia,elasticity,angle,health,damage,zIndex){
        super(x,y,velX,velY,width,height,color,speed,maxSpeed,maxAcceleration,acceleration,secondAcceleration,xAcceleration,yAcceleration,
        mass,angularVelocity,alpha,inertia,elasticity,angle,zIndex);
    }
    
    tick(){
        super.tick();
        
        for(let i = 0; i < entities.length; i++){
            if(entities[i].shootingArray != undefined && entities[i].shootingArray.length != 0){
                for(let j = 0; j < entities[i].shootingArray.length; j++){
                    if(this === entities[i].shootingArray[j])
                        continue;
                    if(checkCollision(this,entities[i].shootingArray[j])){
                        handleCollision(this,entities[i].shootingArray[j]);
                    }
                }
            }
            if(checkCollision(this,entities[i])){// && entities[i].color != this.color){
                handleCollision(this,entities[i]);
            }
        }
        // this.velX = 5;
        // this.x+=this.velX;
    }
    
}

class Character extends Rectangle {
    constructor(x,y,velX,velY,width,height,color,speed,maxSpeed,maxAcceleration,acceleration,secondAcceleration,
    xAcceleration,yAcceleration,mass,angularVelocity,alpha,inertia,elasticity,angle,health,damage,zIndex){
        super(x,y,velX,velY,width,height,color,speed,maxSpeed,maxAcceleration,acceleration,secondAcceleration,xAcceleration,yAcceleration,
        mass,angularVelocity,alpha,inertia,elasticity,angle,zIndex);
        this.health = health;
        this.damage = damage;
        this.shootingArray = [];
        this.collisionFX = [];
    }
    
    collisionFX(x,y,impact){
        //if impact > whatever then create more

        let fx = new Rectangle();
        // fx.x = 


        // this.collisionFX 
    }

    wave(){
        if(this.limbs != undefined && this.limbs.length != 0){
            for(let i = 2; i < this.limbs.length; i++){
                // this.limbs[i].wave = this.limbs[i].wave.bind(this.limbs[i]);
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
    
    shoot(){
        let shot = new Projectile(this.x,this.y,this.velX,this.velY,this.width/4,this.height/4,this.color,this.speed,this.maxSpeed,this.maxAcceleration,this.acceleration,this.secondAcceleration,this.xAcceleration,this.yAcceleration,this.
        mass,this.angularVelocity,this.alpha,this.inertia,this.elasticity,this.angle,this.zIndex);
        let velX = this.velX * 4;
        if(this.velX >= 0){
            if(velX < 2)
                velX = 2;
        }
        else{
            if(velX > -2)
                velX = -2;
        }
        shot.velX=velX*2;
        shot.velY=this.velY*4;
        shot.maxSpeed=160;
        shot.acceleration=6;
        shot.mass=10;
        shot.elasticity = 0.1;
        if(this.shootingArray.length > 20)
            this.shootingArray.shift();
        this.shootingArray.push(shot);
    }
    
    tick(){
        super.tick();
        if(this.shootingArray != undefined && this.shootingArray.length != 0){
            for (let i = 0; i < this.shootingArray.length; i++) {
                this.shootingArray[i].tick();
            }
        }
        
        if(this.limbs != undefined && this.limbs.length != 0){
            for(let i = 0; i < 2; i++){
                this.limbs[i].tick(this.x+10-(i*(this.limbs[i].width+10)),this.y+this.height-15,this.velX,this.velY,this.grabbed);//legs
            }
            for(let i = 2; i < this.limbs.length; i++){
                this.limbs[i].tick(this.x-30+((i-2)*(this.width+this.limbs[i].width+10)),this.y+this.height-32,this.velX,this.velY,this.grabbed);//arms
            }
        }

        if(waveCount == 0 && this.grabbed == false && this.touchingGround() && randomIntFromInterval(0,100) == 0){
            // this.wave = this.wave.bind(this);
            this.wave();
        }

        // wallBounceCollision(this);
    }
    
    render(){
        super.render();
        /*
        context.save();
        context.translate(this.x, this.y);
        if(!this.rotationLock)
            // context.rotate(Math.atan2(this.velY, this.velX));
            context.rotate(this.angle*Math.PI/180);
        // context.fillRect(-this.width/2-(this.width/6), -this.height/2+(this.height/3)+(this.height/12), this.width/6, this.height/6);//leftarm
        // context.fillRect(this.width/2, -this.height/2+(this.height/3)+(this.height/12), this.width/6, this.height/6);//rightarm
        // context.fillRect(-this.width/2+(this.width/3)-(this.width/6), this.height/2, this.width/6, this.height/6);//leftleg
        // context.fillRect(this.width/2-(this.width/3), this.height/2, this.width/6, this.height/6);//rightleg
        context.restore();
        */
        if(this.shootingArray != undefined && this.shootingArray.length != 0){
            for (let i = 0; i < this.shootingArray.length; i++) {
                this.shootingArray[i].render();
            }
        }
        
        if(this.limbs != undefined && this.limbs.length != 0){
            for(let i = 0; i < this.limbs.length; i++){
                this.limbs[i].render(this.x,this.y,this.velX,this.velY);
            }
        }
    }
    
    // constructor(x,y,velX,velY,width,height,color,speed,acceleration){
    createLimbs(){
        this.limbs = [
            new Limbs(0,this.x-40,this.y-40,0,0,this.width/4,this.height/4,this.width,this.height,this.color,10,0.96),
            new Limbs(1,this.x-40,this.y-40,0,0,this.width/4,this.height/4,this.width,this.height,this.color,10,0.96),
            new Limbs(2,this.x-40,this.y-40,0,0,this.width/4,this.height/4,this.width,this.height,this.color,10,0.96),
            new Limbs(3,this.x-40,this.y-40,0,0,this.width/4,this.height/4,this.width,this.height,this.color,10,0.96),
        ];
    }
}
// function angleToVector(angle, magnitude) {
    // return {
        // x: magnitude * Math.cos(angle),
        // y: magnitude * Math.sin(angle)
    // };
// }

// function addVectors(vector1, vector2) {
    // return {
        // x: vector1.x + vector2.x,
        // y: vector1.y + vector2.y
    // };
// }