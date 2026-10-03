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
        this.character = 0; // 0 = blocks; 1 = player; 2 = stars
        this.spacebound = false;
        this.dead = -1;
        
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

    initiate(){
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.velX = 0;
        this.velY = 0;
        this.angle = 0;
        this.speed = 0;
        this.acceleration = 0;
        this.mass = 1;
        this.intertia = 0;
        this.elasticity = 0.5;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.grabbed = false;
        this.currentAngle = 0;
        this.angleAcceleration = 0;
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;
        this.firstMouseX = 0;
        this.firstMouseY = 0;
        this.mouseXVel = 0;
        this.mouseYVel = 0;
        this.bottomLift = 0;
        this.color = "";
        this.character = 0; // 0 = blocks; 1 = player; 2 = stars
        this.spacebound = false;
        this.dead = -1; // 1 = lava; 2 = black hole
    }
    
    applyForce(fx, fy) {
        this.xAcceleration += fx*10 / this.mass;
        this.yAcceleration += fy*10 / this.mass;
    }

    applyTorqueForce(fx, fy, torque) {
        let ax = fx / this.mass;
        let ay = fy / this.mass;
        this.inertia = this.mass * this.width * this.height / 12;
        let alpha = torque / this.inertia;
        if(isNaN(alpha))
            return;
        this.alpha = alpha;
        this.velX += ax/100;
        this.velY += ay/100;
        this.angularVelocity += alpha;
    }
    applyGravity(){
        if(this.velY < terminalVelocityCoeff){
            this.velY += gravityCoeff;
            if(this.velY >= 0)
                this.velY += (this.velY/gravityReductionCoeff); // using this to fight back against friction
        }
    }

    // Iterates velocity if it's bigger than smallest object available in the game to
    // make sure nothing goes through anything
    constantCollisionDetection(){
        let velYIncrements = this.velY;
        while (velYIncrements != 0){

            platformPhysics();

            if(velYIncrements < 0 && this.velY > 0 || velYIncrements > 0 && this.velY < 0)
                velYIncrements *= -1;

            if(velYIncrements > constantCollisionHeight || velYIncrements < -constantCollisionHeight){
                if(velYIncrements< 0){
                    velYIncrements += constantCollisionHeight;
                    this.y-=constantCollisionHeight;
                }
                else{
                    velYIncrements -= constantCollisionHeight;
                    this.y+=constantCollisionHeight;
                }
            }
            else{
                this.y+=velYIncrements;
                velYIncrements = 0;
            }
        }
    }

    addVelocity(){
        this.y+=this.velY;
        this.x+=this.velX;
    }

    colorIncrement(redInc,greInc,bluInc,redEnd,greEnd,bluEnd){
        let hexString = this.color.toString(16);
        hexString = hexString.substring(1,16);
        let redString = hexString.substring(0,2);
        let redNumber = hexToDec(redString);//parseInt(hexString, 16);
        if(redNumber != redEnd)
            redNumber = Number(redNumber)+redInc;
        let greString = hexString.substring(2,4);
        let greNumber = hexToDec(greString);
        if(greNumber != greEnd)
            greNumber = Number(greNumber)+greInc;
        let bluString = hexString.substring(4,6);
        let bluNumber = hexToDec(bluString);
        if(bluNumber != bluEnd)
            bluNumber = Number(bluNumber)+bluInc;

        redNumber = decToHex(redNumber,2);
        greNumber = decToHex(greNumber,2);
        bluNumber = decToHex(bluNumber,2);
        hexString = "#"+redNumber+""+greNumber+""+bluNumber;
        return hexString;
    }
    
    tick(){
        // Not dead
        if(this.dead == -1){
            if(this.grabbed){
                this.grabbingRotation();
                if(!this.rotationLock)
                    this.angle = Math.atan2(this.rotationY,this.rotationX);
                return;
            }
            if(!this.spacebound)
                this.applyGravity();

            this.velX += this.xAcceleration;
            this.velY += this.yAcceleration;
            
            this.position = new Vector(this.x,this.y);
            this.velocity = new Vector(this.velX,this.velY);

            // This will have the orientation always change
            if(!this.rotationLock){
                if(!this.touchingGround())
                    this.angle = Math.atan2(this.velY-2, this.velX);
                else
                    this.angle = -(Math.atan2(this.velY-2, this.velX));
            }
            
            friction(this,frictionCoeff);
            this.addVelocity();

            // Applying black hole changes to velocity
            for(let i = 0; i < blackHoles.length; i++){
                if(checkCollision(this,blackHoles[i])){
                    const radians = Math.atan2(blackHoles[i].y-this.y, blackHoles[i].x-this.x);
                    const angle = radians * 180 / Math.PI;
                    const strength = 0;//200; // go negative
                    const distance = Math.sqrt(((blackHoles[i].x-this.x) ** 2) + ((blackHoles[i].y-this.y) ** 2));
                    let angleX = Math.cos(angle);
                    let angleY = Math.sin(angle);
                    if(angleX == 0)
                        angleX = 1;
                    if(angleY == 0)
                        angleY = 1;
                    let velXTemp = ((strength-distance)/100)*angleX;//(Math.cos(angle));
                    let velYTemp = ((strength-distance)/100)*angleY;//(Math.sin(angle));
                    if(this.x < blackHoles[i].x && velXTemp < 0 || blackHoles[i].x < this.x && velXTemp > 0 )
                        velXTemp *= -1;
                    if(this.y < blackHoles[i].y && velYTemp < 0 || blackHoles[i].y < this.y && velYTemp > 0 )
                        velYTemp *= -1;

                    this.velX +=velXTemp;
                    this.velY +=velYTemp;
                }
                if(checkCollision(this,blackHoles[i].innerBlackHole))
                    this.dead = 2;
            }
            if(activatingLava && lavaY+canvas.height <= this.y+(this.height/2))
                this.dead = 1;
        }

        // Dead by lava
        if(this.dead == 1 && this.character != 2){
            this.x -= 0.7*(lavaSinWaveOffsetVel*100);
            if(this.color.localeCompare("#FF0000") != 0){
                this.color = this.colorIncrement(1,-1,-1,255,0,0);
            }
            this.warpVerticesToLine();
        }
        // Dead by black hole
        else if(this.dead == 2){
            for(let i = 0; i < blackHoles.length; i++){
                if(checkCollision(this,blackHoles[i].innerBlackHole)){
                    this.warpVerticesToPoint(blackHoles[i].innerBlackHole);
                    if(this.deadPoint.x != blackHoles[i].innerBlackHole.x || this.deadPoint.y != blackHoles[i].innerBlackHole.y)
                        this.deadPoint = new Vector(blackHoles[i].innerBlackHole.x,blackHoles[i].innerBlackHole.y);
                }
            }
        }
    }
    
    render(){
        if(this.dead != -1){
            this.verticesRender();
            return;
        }
        const tempShadowBlur = context.shadowBlur;
        const tempShadowColor = context.shadowColor;
        const tempFill = context.fillStyle;
        if(this.spacebound){
            context.shadowBlur = 40;
            context.shadowColor = "#f8f8f8";
        }
        context.fillStyle = this.color;

        this.angleTranslate(context);

        if(this.spacebound){
            context.shadowBlur = tempShadowBlur;
            context.shadowColor = tempShadowColor;
        }
        context.fillStyle = tempFill;
    }
    
    angleTranslate(){
        context.save();
        context.translate(this.x-camera.x, this.y-camera.y);
        if(this.grabbed)
            playerTrajectoryFX(this.trajectoryFXVel,this.angle);
        if(!this.rotationLock)
            context.rotate(this.angle);
        context.fillRect((-this.width/2), (-this.height/2), this.width, this.height);
        context.restore();
    }

    warpVerticesToPoint(point){
        const speed = 0.4;
        for(let i = 0; i < this.vertices.length; i++){
            if(this.vertices[i].x+this.x < point.x)
                this.vertices[i].x+=speed;
            else
                this.vertices[i].x-=speed;
            if(this.vertices[i].y+this.y < point.y)
                this.vertices[i].y+= speed;
            else
                this.vertices[i].y-=speed;
        }
        this.getVertices();
    }

    warpVerticesToLine(){
        const point = new Vector(this.x,this.y+70);
        const speed = 0.13;//0.1;
        let rand = Math.random()*10;
        
        for(let i = 0; i < this.vertices.length; i++){
            if(this.vertices[i].x+this.x < point.x+((i*rand)*40))
                this.vertices[i].x+=speed;
            else
                this.vertices[i].x-=speed;
            if(this.vertices[i].y+this.y < point.y)
                this.vertices[i].y+= speed;
            else
                this.vertices[i].y-=speed;
        }
        this.getVertices();
    }

    verticesRender(){
        const tempStroke = context.strokeStyle;
        context.fillStyle = this.color;
        context.strokeStyle = this.color;

        context.beginPath();
        context.moveTo(this.vertices[0].x-camera.x+this.x,this.vertices[0].y-camera.y+this.y);
        for(let i = 1; i < this.vertices.length; i++){
            context.lineTo(this.vertices[i].x+this.x-camera.x,this.vertices[i].y-camera.y+this.y);
        }
        context.stroke();
        context.fill();
        context.closePath();

        context.strokeStyle = tempStroke;
    }
    
    getEdges() {
        const vertices = this.getVertices();
        const edges = [];
        for (let i = 0; i < vertices.length; i++) {
            const j = (i + 1) % vertices.length;
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
        this.deadPoint = new Vector(0,0);
        this.grabbed = false;
        this.angleAcceleration = 0;
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;
        this.bottomLift = 0;
    }

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
    }
  
    translate(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.getVertices();
    }  
    
    // Calculates the change in velocity caused by the impulse
    applyImpulse(impulse) {
        const dv = impulse.divide(this.mass);
        this.velocity = this.velocity.add(dv);
    }
    
    // Currently not used
    reOrient(){
        this.angularVelocity = 0;
        this.angle = 0;
        this.getVertices();
    }

    touchingGround(){
        for(let i = 0; i < platforms.length; i++){
            const ovX = getOverlapX(platforms[i],this);
            if(ovX >= 0 && this.y < platforms[i].y && this.y > platforms[i].y - (platforms[i].height/2) - this.bottomLift - this.height -1 )
                return true;
        }
        return false;
    }

    // Bottom of starting zone
    touchingBottomGround(){
        return (this.y > canvas.height - this.bottomLift - this.height - 1);
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Adds a vector to this vector
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    // Subtracts a vector from this vector
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    // Returns scaled vector
    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    // Returns scaled vector
    divide(scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    }

    // Scales this vector by a scalar value
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }  
    
    // Returns the length (magnitude) of the vector
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    
    normal() {
        return new Vector(-this.y, this.x);
    }
    
    dot(otherVector) {
        return this.x * otherVector.x + this.y * otherVector.y;
    }

    // Rotates this vector by an angle in radians
    rotate(angle) {
        if(angle == null || isNaN(angle))
            return;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        this.x = x;
        this.y = y;
    }
}