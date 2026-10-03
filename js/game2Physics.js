const collisionCoeff = 0.08; // coefficient of restitution
const frictionCoeff = 0.9501;  // coefficient of friction
const gravityCoeff = 9.8;//0.2    // coefficient of gravity
const objectCorrectionCoeff = 0.8; // makes objects repel off each other
const bottomLift = 15;
// function moveCharacterMax(character,direction){
    // if(direction == -1){
        // if(character.velX > character.maxSpeed * -1)
            // character.velX -= character.secondAcceleration;
    // }
    // else{
        // if(character.velX < character.maxSpeed)
            // character.velX += character.secondAcceleration;
    // }
// }

function resetAcceleration(rect){
    rect.xAcceleration = 0;
    rect.yAcceleration = 0;
}

function speedLimiter(rect){
    if(rect.velX > rect.maxSpeed)
        rect.velX = rect.maxSpeed;
    if(rect.velY > rect.maxSpeed)
        rect.velY = rect.maxSpeed;
}

function velXUpdate(character,direction){
    if(direction == -1){
        if(character.velX > character.speed * -1){
            character.velX -= character.xAcceleration;
        }
        // else if(character.velX > character.maxSpeed * -1)
            // character.velX -= character.secondAcceleration;
    }
    else{
        if(character.velX < character.speed){
            character.velX += character.xAcceleration;
        }
        // else if(character.velX < character.maxSpeed)
            // character.velX += character.secondAcceleration;
    }
    // moveCharacterMax(character,direction);
}

function velXT(character,direction){
    if(direction == -1){
        // if(character.velX > character.speed * -1){
            if(character.xAcceleration > character.maxAcceleration * -1)
                character.xAcceleration-=character.acceleration;
            // character.velX -= character.xAcceleration;
        // }
        // else if(character.velX > character.maxSpeed * -1)
            // character.velX -= character.secondAcceleration;
    }
    else{
        // if(character.velX < character.speed){
            if(character.xAcceleration < character.maxAcceleration)
                character.xAcceleration+=character.acceleration;
            // character.velX += character.xAcceleration;
        // }
        // else if(character.velX < character.maxSpeed)
            // character.velX += character.secondAcceleration;
    }
    // moveCharacterMax(character,direction);
}

function velYUpdate(character,direction){
    if(direction == -1){
        if(character.velY > character.speed * -1){
            character.velY -= character.yAcceleration;
        }
        // else if(character.velY > character.maxSpeed * -1)
            // character.velY -= character.secondAcceleration;
    }
    else{
        if(character.velY < character.speed){
            character.velY += character.yAcceleration;
        }
        // else if(character.velY < character.maxSpeed)
            // character.velY += character.secondAcceleration;
    }
}

function velYT(character,direction){
    if(direction == -1){
        // if(character.velY > character.speed * -1){
            if(character.yAcceleration > character.maxAcceleration * -1)
                character.yAcceleration-=character.acceleration;
            // character.velY -= character.yAcceleration;
        // }
        // else if(character.velY > character.maxSpeed * -1)
            // character.velY -= character.secondAcceleration;
    }
    else{
        // if(character.velY < character.speed){
            if(character.yAcceleration < character.maxAcceleration)
                character.yAcceleration+=character.acceleration;
            // character.velY += character.yAcceleration;
        // }
        // else if(character.velY < character.maxSpeed)
            // character.velY += character.secondAcceleration;
    }
}

function moveCharacter(character){
    character.x+=character.velX;
    character.y+=character.velY;
}

function inertia(rect){
    const tempVelX = rect.velX;
    const tempVelY = rect.velY;
    if(rect.velX != 0){
        if(rect.velX < 0)
            rect.velX += (tempVelY/10);
        else
            rect.velX -= (tempVelY/10);
    }
    if(rect.velY != 0){
        if(rect.velY < 0)
            rect.velY += (tempVelX/10);
        else
            rect.velY -= (tempVelX/10);
    }
}

function friction(rect){
    if(rect.velX == 0 && rect.velY == 0){}
    // else if(rect.velX < 0)            // with frictionCoeff as 0.05001
        // rect.velX+=frictionCoeff;
    // else
        // rect.velX-=frictionCoeff;
    // if(rect.velY == 0){}
    // else if(rect.velY < 0)
        // rect.velY+=frictionCoeff;
    // else
        // rect.velY-=frictionCoeff;
    else{
        rect.velX *= frictionCoeff;
        rect.velY *= frictionCoeff;
    }
}

function velocityCollision(rect1,rect2){
    // calculate relative velocity
    const rvx = rect2.velX - rect1.velX;
    const rvy = rect2.velY - rect1.velY;

    // calculate normal vector
    const nx = rect2.x - rect1.x;
    const ny = rect2.y - rect1.y;

    if (rvx * nx + rvy * ny < 0) {
        /*
        // calculate impulse
        const j =
        -collisionCoeff *
        (rvx * nx + rvy * ny) /
        (nx * nx + ny * ny) *
        (rect1.mass + rect2.mass);

        // apply impulse to rectangles
        rect1.velX -= j * nx / rect1.mass;
        rect1.velY -= j * ny / rect1.mass;
        rect2.velX += j * nx / rect2.mass;
        rect2.velY += j * ny / rect2.mass;
        speedLimiter(rect1);
        speedLimiter(rect2);*/
        
        // calculate the restitution coefficient
        const elast = Math.min(rect1.elasticity, rect2.elasticity);
        // calculate impulse
        const j =
        -elast *
        (rvx * nx + rvy * ny) /
        (nx * nx + ny * ny) *
        (rect1.mass + rect2.mass);
        // const j1 =
        // -rect1.elasticity *
        // (rvx * nx + rvy * ny) /
        // (nx * nx + ny * ny) *
        // (rect1.mass + rect2.mass);
        // const j2 =
        // -rect2.elasticity *
        // (rvx * nx + rvy * ny) /
        // (nx * nx + ny * ny) *
        // (rect1.mass + rect2.mass);

        // apply impulse to rectangles
        rect1.velX -= j * nx / rect1.mass;
        rect1.velY -= j * ny / rect1.mass;
        rect2.velX += j * nx / rect2.mass;
        rect2.velY += j * ny / rect2.mass;
        speedLimiter(rect1);
        speedLimiter(rect2);
    }
}

function torqueCollision(rect1,rect2){
    // calculate collision normal and radius for rect1
    let nx = rect2.x - rect1.x;
    let ny = rect2.y - rect1.y;
    let length = Math.sqrt(nx * nx + ny * ny);
    nx /= length;
    ny /= length;
    let rx1 = -rect1.width/2 * ny;
    let ry1 = rect1.width/2 * nx;

    // calculate collision force for rect1
    let fx1 = -nx * getOverlap(rect1,rect2) * (rect1.elasticity+rect2.elasticity/2);
    let fy1 = -ny * getOverlap(rect1,rect2) * (rect1.elasticity+rect2.elasticity/2);

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

function swapVelocities(rect1,rect2){
    const tempVx = rect1.velX;
    const tempVy = rect1.velY;
    rect1.velX = rect2.velX;
    rect1.velY = rect2.velY;
    rect2.velX = tempVx;
    rect2.velY = tempVy;
}

function wallBounceCollision(rect){
    // if (rect.x < 0 || rect.x + rect.width > canvas.width) {
    if (rect.x-rect.width/2 < 0 || rect.x+rect.width/2 > canvas.width) {
      rect.velX = -(rect.velX/1.2);
    }
    // if (rect.y < 0 || rect.y + rect.height > canvas.height) {
    if (rect.y-rect.height/2 < 0 || rect.y+rect.height/2 > canvas.height -bottomLift) {
      rect.velY = -(rect.velY/1.2);
    }
}  

function wallBounceCollision2(rect,wallCollisionWall){
    // if (rect.x < 0 || rect.x + rect.width > canvas.width) {
    if (wallCollisionWall == 0 || wallCollisionWall == 2) {
      rect.velX = -(rect.velX/1.2);
    }
    // if (rect.y < 0 || rect.y + rect.height > canvas.height) {
    else {
      rect.velY = -(rect.velY/1.2);
    }
}  

function wallCollisionNormal(rect){
    const leftWallStart = new Vector(0, 0);
    const leftWallEnd = new Vector(0, canvas.height);
    const lx = leftWallEnd.x - leftWallStart.x;
    const ly = leftWallEnd.y - leftWallStart.y;
    const leftWallDirection = new Vector(lx,ly);//leftWallEnd.subtract(leftWallStart);
    const leftWallNormal = new Vector(-leftWallDirection.y, leftWallDirection.x);
    return leftWallNormal;
}

/*
function wallCollisionNormal(rect) {
    // Check if the rectangle is colliding with any of the walls
    if (rect.x-rect.width/2 < 0) {
      // Colliding with the left wall, normal is pointing to the right
      return new Vector(1, 0);
    } else if (rect.x+rect.width/2 > canvas.width) {
      // Colliding with the right wall, normal is pointing to the left
      return new Vector(-1, 0);
    } else if (rect.y-rect.height/2 < 0) {
      // Colliding with the top wall, normal is pointing downwards
      return new Vector(0, 1);
    } else if (rect.y+rect.height/2 > canvas.height) {
      // Colliding with the bottom wall, normal is pointing upwards
      return new Vector(0, -1);
    } else {
      // Not colliding with any walls
      return null;
    }
}*/

// Get the edges of the rectangle
function getEdges(vertices) {
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

function outerWallCollision(rect) {
    let rectEdges = rect.getEdges();
    let vertices2 = rect.getVertices();
    const outerWallCount = [];
    let outerWallEdges = [];
    const outerWallVertices = [];
    let verticesLeft = [                     // Left wall
            new Vector(0, 0),
            new Vector(0, canvas.height),
    ];
    let verticesTop = [                     // Top wall
            new Vector(0, 0),
            new Vector(canvas.width,0),
    ];
    let verticesRight = [                     // Right wall
            new Vector(canvas.width, 0),
            new Vector(canvas.width, canvas.height),
    ];
    let verticesBottom = [                     // Bottom wall
            new Vector(0, canvas.height-bottomLift),
            new Vector(canvas.width, canvas.height-bottomLift),
    ];
    const edgeLeft = getEdges(verticesLeft);
    const edgeTop = getEdges(verticesTop);
    const edgeRight = getEdges(verticesRight);
    const edgeBottom = getEdges(verticesBottom);
    outerWallVertices.push(verticesLeft);
    outerWallVertices.push(verticesTop);
    outerWallVertices.push(verticesRight);
    outerWallVertices.push(verticesBottom);
    outerWallCount.push(edgeLeft);
    outerWallCount.push(edgeTop);
    outerWallCount.push(edgeRight);
    outerWallCount.push(edgeBottom);
    for(let oCounter = 0; oCounter < outerWallCount.length; oCounter++){
        let vertices1 = outerWallVertices[oCounter];
        let edges1 = outerWallCount[oCounter];
        let edge = edges1[0];
        
        for (let i = 0; i < rectEdges.length; i++) {
            const axis = edge.normal();
            
            const projections1 = vertices1.map(v => v.dot(axis));
            const projections2 = vertices2.map(v => v.dot(axis));
            
            // calculate the minimum and maximum projections for both rectangles
            const min1 = Math.min(...projections1);
            const max1 = Math.max(...projections1);
            const min2 = Math.min(...projections2);
            const max2 = Math.max(...projections2);

            // calculate the overlap between the projections
            const overlap = Math.min(max1, max2) - Math.max(min1, min2);
            
            if(overlap >= 0){
                // console.log("ocounter = "+oCounter+" overlap = "+overlap + " oCounter = "+oCounter);
                return oCounter;
            }
        }
    }
  // If all edges overlap with the canvas edge, the shapes intersect
  // return nego;
  return -1;
}

function collision(rect1,rect2){
    return !(rect2.x > rect1.x+rect1.width ||
            rect2.x+rect2.width < rect1.x ||
            rect2.y > rect1.y+rect1.height ||
            rect2.y+rect2.height < rect1.y);
    // if (
        // rect1.x < rect2.x + rect2.width &&
        // rect1.x + rect1.width > rect2.x &&
        // rect1.y < rect2.y + rect2.height &&
        // rect1.y + rect1.height > rect2.y
    // )
}

function wallCorrection(rect){
    //if(rect.x < 0)
        //rect.x = 0;
    // else if(rect.x+rect.width > canvas.width)
        // rect.x = canvas.width - rect.width;
    // if(rect.y < 0)
        // rect.y = 0;
    // else if(rect.y+rect.height > canvas.height)
        // rect.y = canvas.height - rect.height;
    if(rect.x-rect.width/2 < 0)
        rect.x = 0+rect.width/2;
    else if(rect.x+rect.width/2 > canvas.width)
        rect.x = canvas.width - rect.width/2;
    if(rect.y-rect.height/2 < 0)
        rect.y = 0+rect.height/2;
    else if(rect.y+rect.height/2 > canvas.height-bottomLift)
        rect.y = canvas.height - rect.height/2-bottomLift;
}

function objectCorrection(rect1,rect2){
    if(rect1.x < rect2.x && 
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x)
        rect1.x-=objectCorrectionCoeff; //= rect2.x-rect1.width-1;
    else if(rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x+rect2.width)
        rect1.x+=objectCorrectionCoeff;
    if(rect1.y < rect2.y && 
        rect1.y < rect2.y + rect2.height &&
       rect1.y + rect1.height > rect2.y)
       rect1.y-=objectCorrectionCoeff;// = rect2.y-rect1.height-1;
    else if(rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y+rect2.height)
       rect1.y+=objectCorrectionCoeff;
}

function overlapAvoidance(rect1,rect2,nx,ny){
    // separate the rectangles along the collision normal
    const overlap = (rect1.width + rect2.width) / 2 - Math.abs(nx);
    rect1.x -= overlap * nx / (nx * nx + ny * ny);
    rect1.y -= overlap * ny / (nx * nx + ny * ny);
    rect2.x += overlap * nx / (nx * nx + ny * ny);
    rect2.y += overlap * ny / (nx * nx + ny * ny);
}

function getOverlapX(rect1, rect2) {
  const rect1MinX = rect1.x - rect1.width / 2;
  const rect1MaxX = rect1.x + rect1.width / 2;
  const rect2MinX = rect2.x - rect2.width / 2;
  const rect2MaxX = rect2.x + rect2.width / 2;

  const overlapX = Math.min(rect1MaxX, rect2MaxX) - Math.max(rect1MinX, rect2MinX);
  
  return overlapX;
}

function getOverlapY(rect1, rect2) {
  const rect1MinY = rect1.y - rect1.height / 2;
  const rect1MaxY = rect1.y + rect1.height / 2;
  const rect2MinY = rect2.y - rect2.height / 2;
  const rect2MaxY = rect2.y + rect2.height / 2;

  const overlapY = Math.min(rect1MaxY, rect2MaxY) - Math.max(rect1MinY, rect2MinY);
  
  return overlapY;
}

function getOverlap(rect1,rect2){
    const overlapX = getOverlapX(rect1, rect2);
    const overlapY = getOverlapY(rect1, rect2);
    const totalOverlap = overlapX * overlapY;
    return totalOverlap;
}

function getNormalOverlap(rect1,normal){
    // Project the rectangle onto the normal vector
    const projected = rect1.vertices.map(v => v.dot(normal));

    // Calculate the minimum and maximum projections
    const min = Math.min(...projected);
    const max = Math.max(...projected);

    // Calculate the overlap
    const overlap = Math.min(rect1.width, max) - Math.max(0, min);

    return overlap;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getPerpendicularAxis(edge) {
    if(edge == null)
        return;
    const x1 = edge[0].x;
    const y1 = edge[0].y;
    const x2 = edge[1].x;
    const y2 = edge[1].y;

    const dx = x2 - x1;
    const dy = y2 - y1;

    return {
        x: -dy,
        y: dx,
    };
}

function centerOfMassRect(rect){
    const rectVertices = rect.getVertices();
    // const rectPosition = rect.position;
    const rectPosition = new Vector(mouseX,mouseY);
    const rectAngle = rect.angle;
    // Calculate the x and y coordinates of the center point
    let centerX = 0;
    let centerY = 0;
    for (let i = 0; i < rectVertices.length; i++) {
      centerX += rectVertices[i].x;
      centerY += rectVertices[i].y;
    }
    centerX /= rectVertices.length;
    centerY /= rectVertices.length;

    // Create a new Vector object to represent the center point
    // const centerPointt = new Vector(centerX-mouseOffsetX, centerY-mouseOffsetY);
    const centerPointt = new Vector(centerX, centerY);

    // Translate the center point
    // centerPoint = centerPoint.subtract(rectPosition);
    let centerPoint = new Vector(centerPointt.x - rectPosition.x, centerPointt.y - rectPosition.y);
    

    // Rotate the center point
    // centerPoint = centerPoint.rotate(rectAngle);
    centerPoint.rotate(rectAngle);

    // Translate the center point back to the rectangle's position
    // centerPoint = centerPoint.add(rectPosition);
    const centerOfMass = new Vector(centerPoint.x + rectPosition.x, centerPoint.y + rectPosition.y);
    
    return centerOfMass;
}

function projectRect(rect, axis) {
    const vertices = rect.getVertices();
    let min = Infinity;
    let max = -Infinity;

    for (let i = 0; i < vertices.length; i++) {
        const dotProduct = vertices[i].x * axis.x + vertices[i].y * axis.y;
        if (dotProduct < min) {
            min = dotProduct;
        }
        if (dotProduct > max) {
            max = dotProduct;
        }
    }

    return { min, max };
}

function checkCollisionPoint(vertices,edges,rect){
    const edge = edges[0];
    const vertices2 = rect.getVertices();
    
    for (let i = 0; i < rect.getEdges().length; i++) {
        const axis = edge.normal();
        
        const projections1 = vertices.map(v => v.dot(axis));
        const projections2 = vertices2.map(v => v.dot(axis));
        
        // calculate the minimum and maximum projections for both rectangles
        const min1 = Math.min(...projections1);
        const max1 = Math.max(...projections1);
        const min2 = Math.min(...projections2);
        const max2 = Math.max(...projections2);

        // calculate the overlap between the projections
        const overlap = Math.min(max1, max2) - Math.max(min1, min2);
        
        if(overlap >= 0){
            return overlap;
        }
    }
    return -1;
}

function checkCollision(rect1, rect2) {
    // get the edges and vertices of both rectangles
    const edges1 = rect1.getEdges();
    const vertices1 = rect1.getVertices();
    const edges2 = rect2.getEdges();
    const vertices2 = rect2.getVertices();

    // if(edges1 == undefined || edges2 == undefined)
    // return;

    // define variables to store minimum and maximum projections
    let minOverlap = Infinity;
    let axisWithMinOverlap = null;

    // loop through all the edges of both rectangles
    for (let edges of [edges1, edges2]) {
        for (let edge of edges) {
            // if(edge == undefined)
            // break;
            // get the axis perpendicular to the edge
            const axis = edge.normal();

            // if(vertices2 == undefined || vertices1 == undefined)
            // break;
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
    
    /*
    // if we reach here, the rectangles are colliding
    // resolve the collision along the axis with the minimum overlap
    const m1 = rect1.mass;
    const m2 = rect2.mass;
    const totalMass = (m1 + m2);/*
    const overlap1 = minOverlap * m2 / totalMass/ 100000000;
    const overlap2 = minOverlap * m1 / totalMass / 100000000;
    // console.log(axisWithMinOverlap.x + "overlap = "+overlap1 + " overlap2 = "+overlap2);
    console.log('Overlap:', overlap1);
    console.log('axisWithMinOverlap:', axisWithMinOverlap);
console.log('Translation:', axisWithMinOverlap.multiply(overlap1));
    // rect1.translate(-axisWithMinOverlap.multiply(overlap1));
    // rect2.translate(axisWithMinOverlap.multiply(overlap2));
    // axisWithMinOverlap.multiply(overlap1);
    // axisWithMinOverlap.x *= -1;
    // axisWithMinOverlap.y *= -1;
    // rect1.translate(-axisWithMinOverlap.x,-axisWithMinOverlap.y);
    // axisWithMinOverlap.multiply(overlap2);
    // rect2.translate(axisWithMinOverlap.x,axisWithMinOverlap.y); ////////block
    
    
    const overlap1 = minOverlap * m2 / totalMass;
    const overlap2 = minOverlap * m1 / totalMass ;
    axisWithMinOverlap.multiply(overlap1);
    axisWithMinOverlap.x *= -1;
    axisWithMinOverlap.y *= -1;
    axisWithMinOverlap.multiply(overlap2);
    const nx = rect2.x - rect1.x;
    const ny = rect2.y - rect1.y;
    overlapAvoidance(rect1,rect2,nx,ny);//GET RID OF


    // calculate the relative velocity of the two rectangles
    rect2.velocity.x -= rect1.velocity.x;
    rect2.velocity.y -= rect1.velocity.y;
    const rv = new Vector(rect2.velocity.x,rect2.velocity.y);//rect2.velocity.subtract(rect1.velocity);
    if(rv == null || rv == undefined)
        return false;

    // calculate the relative velocity in terms of the collision normal (the axis with the minimum overlap)
    const velAlongNormal = rv.dot(axisWithMinOverlap);

    // if the relative velocity is separating, the rectangles are already moving away from each other, return false
    if (velAlongNormal > 0) {
        return false;
    }
    
    

    // calculate the restitution coefficient
    const e = Math.min(rect1.elasticity, rect2.elasticity);

    // calculate the impulse to apply to the two rectangles
    const impulse = axisWithMinOverlap.multiply(-(1 + e) * velAlongNormal / totalMass);

    // apply the impulse to the two rectangles
    rect1.applyImpulse(impulse.multiply(m2));
    rect2.applyImpulse(impulse.multiply(-m1));
    
    return true;*/
}

function handleCollision(rect1,rect2){
    const nx = rect2.x - rect1.x;
    const ny = rect2.y - rect1.y;
    torqueCollision(rect1,rect2);
    velocityCollision(rect1,rect2);
    // overlapAvoidance(rect1,rect2,nx,ny); // only use on seperate entities
}

function physics(rect1){
    // rect1.applyForce(0, gravityCoeff); // gravity
    // rect2.applyForce(0, gravityCoeff); // gravity
    // rect1.applyGravity(gravityCoeff);
    // rect2.applyGravity(gravityCoeff);
    
    // velXUpdate(rect1);
    // velYUpdate(rect1);
    // rect1.velX += rect1.xAcceleration;
    // rect1.velY += rect1.yAcceleration;
    rect1.tick();
    
    
    // applyForce(rect1, 0.9, 0); // test
    // applyForce(rect2, 0.9, 0); // test
    
    // friction(rect1);
    
    
    // moveCharacter(rect1);
    const wallCollNormal = wallCollisionNormal(rect1); // FIX THIS
    const wallCollisionWall = outerWallCollision(rect1);
    if(wallCollisionWall != -1){
        wallBounceCollision(rect1);
        // if(wallCollisionWall != -1){
            // switch(wallCollisionWall){
                // case 0:
                    // rect1.x += 3;
                // case 1:
                    // rect1.y += 3;
                // case 2:
                    // rect1.x -= 3;
                // case 3:
                    // rect1.y -= 3;
                // default:
                    // break;
            // }
        // }
        /*
        switch(wallCollisionWall){
            case 0:
                // const leftRect = new Rectangle();
                // leftRect.x = 0;
                // leftRect.y = 0;
                // leftRect.height = canvas.height;
                // leftRect.width = 0;
                // leftRect.mass = Number.MAX_SAFE_INTEGER;//Infinity;
                // leftRect.velX = 0;
                // leftRect.velY = 0;
                // leftRect.elasticity = 0.5;//Number.MIN_VALUE;
                // leftRect.createVertices();
                // handleCollision(rect1,leftRect);
                const rv = rect1.velocity;
                const impulse = (1 + rect1.elasticity) * rv.dot(wallCollNormal) / (1/rect1.mass + 1/Number.MAX_SAFE_INTEGER);
                const impulseVector = wallCollNormal.multiply(impulse);
                rect1.applyImpulse(impulseVector);
                break;
            default:
                break;
        }
        // console.log("YASS");
        // if(getNormalOverlap(rect1,wallCollNormal)){
            // console.log("YASS2");
        // }*/
    }
    
    
    for (let i = 0; i < entities.length; i++) {
        if(rect1 === entities[i])
            continue;
        if(checkCollision(rect1,entities[i])){//|| checkCollision (rect2,rect1)){
            /*
            // calculate normal vector
            const nx = rect2.x - rect1.x;
            const ny = rect2.y - rect1.y;
            velocityCollision(rect1,rect2);
            overlapAvoidance(rect1,rect2,nx,ny);
            objectCorrection(rect1,rect2);
            objectCorrection(rect2,rect1);*/
            handleCollision(rect1,entities[i]);
        }
    }
    // character1.tick(gravityCoeff);
    // character2.tick(gravityCoeff);
    // inertia(rect1);
    // inertia(rect2);
    wallCorrection(rect1);
    
    resetAcceleration(rect1);
}