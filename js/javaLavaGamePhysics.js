const collisionCoeff = 0.08;        // coefficient of restitution
const frictionCoeff = 0.9501;       // coefficient of friction
const gravityCoeff = 0.3;//0.2 //9.8// coefficient of gravity
const gravityReductionCoeff = 35;   // combats friction when reaching terminal velocity
const terminalVelocityCoeff = 9.8;  // coefficient of terminal velocity
const objectCorrectionCoeff = 0.8;  // makes objects repel off each other
const bottomLiftCoeff = 15;         // distance between character and platforms for limbs
const constantCollisionHeight = 10; // smallest height of object in game for constant collision detection

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

// Movement from keyboard
function velXT(character,direction){
    if(direction == -1){
        if(character.xAcceleration > character.maxAcceleration * -1)
            character.xAcceleration-=character.acceleration;
    }
    else{
        if(character.xAcceleration < character.maxAcceleration)
            character.xAcceleration+=character.acceleration;
    }
}

// Movement from keyboard
function velYT(character,direction){
    if(direction == -1){
        if(character.yAcceleration > character.maxAcceleration * -1)
            character.yAcceleration-=character.acceleration;
    }
    else{
        if(character.yAcceleration < character.maxAcceleration)
            character.yAcceleration+=character.acceleration;
    }
}

function friction(rect,friction){
    if(rect.velX != 0 || rect.velY != 0){
        rect.velX *= friction;
        rect.velY *= friction;
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
        // calculate the restitution coefficient
        const elast = Math.min(rect1.elasticity, rect2.elasticity);
        // calculate impulse
        const j =
        -elast *
        (rvx * nx + rvy * ny) /
        (nx * nx + ny * ny) *
        (rect1.mass + rect2.mass);

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
    const minElast = Math.min(rect1.elasticity,rect2.elasticity);
    let fx1 = -nx * getOverlapX(rect1,rect2) * (minElast);
    let fy1 = -ny * getOverlapY(rect1,rect2) * (minElast);

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

function wallBounceCollision(rect){
    if (rect.x-rect.width/2 < 0 || rect.x+rect.width/2 > canvas.width) 
      rect.velX = -(rect.velX/1.2);
    if (rect.y+rect.height/2 > canvas.height -rect.bottomLift) {
      rect.velY = -(rect.velY/1.2);
      characterJumpReset(rect);
    }
}

// Get the edges of an object
function getEdges(vertices) {
    const edges = [];
    for (let i = 0; i < vertices.length; i++) {
        const j = (i + 1) % vertices.length;
        const edge = new Vector(vertices[j].x - vertices[i].x, vertices[j].y - vertices[i].y);
        edges.push(edge);
    }
    return edges;
}

function outerWallCollision(rect) {
    let rectEdges = rect.getEdges();
    let vertices2 = rect.getVertices();
    const outerWallCount = [];
    const outerWallVertices = [];
    let verticesLeft = [                     // Left wall
            new Vector(0, 0),
            new Vector(0, canvas.height),
    ];
    let verticesRight = [                     // Right wall
            new Vector(canvas.width, 0),
            new Vector(canvas.width, canvas.height),
    ];
    let verticesBottom = [                     // Bottom wall
            new Vector(0, canvas.height-rect.bottomLift),
            new Vector(canvas.width, canvas.height-rect.bottomLift),
    ];
    const edgeLeft = getEdges(verticesLeft);
    const edgeRight = getEdges(verticesRight);
    const edgeBottom = getEdges(verticesBottom);
    outerWallVertices.push(verticesLeft);
    outerWallVertices.push(verticesRight);
    outerWallVertices.push(verticesBottom);
    outerWallCount.push(edgeLeft);
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
            
            if(overlap >= 0)
                return oCounter;
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
}

function wallCorrection(rect){
    if(rect.x-rect.width/2 < 0)
        rect.x = 0+rect.width/2;
    else if(rect.x+rect.width/2 > canvas.width)
        rect.x = canvas.width - rect.width/2;
    if(rect.y+rect.height/2 > canvas.height-rect.bottomLift)
        rect.y = canvas.height - rect.height/2-rect.bottomLift;
}

function objectCorrection(rect1,rect2){
    if(rect1.x < rect2.x && 
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x)
        rect1.x-=objectCorrectionCoeff;
    else if(rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x+rect2.width)
        rect1.x+=objectCorrectionCoeff;
    if(rect1.y < rect2.y && 
        rect1.y < rect2.y + rect2.height &&
       rect1.y + rect1.height > rect2.y)
       rect1.y-=objectCorrectionCoeff;
    else if(rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y+rect2.height)
       rect1.y+=objectCorrectionCoeff;
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

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function checkCollision(rect1, rect2) {
    // get the edges and vertices of both rectangles
    const edges1 = rect1.getEdges();
    const vertices1 = rect1.getVertices();
    const edges2 = rect2.getEdges();
    const vertices2 = rect2.getVertices();

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

function handleCollision(rect1,rect2){
    torqueCollision(rect1,rect2);
    velocityCollision(rect1,rect2);
    // const nx = rect2.x - rect1.x;
    // const ny = rect2.y - rect1.y;
    // overlapAvoidance(rect1,rect2,nx,ny); // only use on seperate entities
}

function physics(rect1){
    // const wallCollNormal = wallCollisionNormal(rect1); // FIX THIS
    const wallCollisionWall = outerWallCollision(rect1);
    if(wallCollisionWall != -1)
        wallBounceCollision(rect1);
    
    for (let i = 0; i < blocks.length; i++) {
        if(rect1 === blocks[i])
            continue;
        if(checkCollision(rect1,blocks[i]))
            handleCollision(rect1,blocks[i]);
    }

    wallCorrection(rect1);
    
    resetAcceleration(rect1);
}


// Unused functions


function wallCollisionNormal(rect){
    const leftWallStart = new Vector(0, 0);
    const leftWallEnd = new Vector(0, canvas.height);
    const lx = leftWallEnd.x - leftWallStart.x;
    const ly = leftWallEnd.y - leftWallStart.y;
    const leftWallDirection = new Vector(lx,ly);
    const leftWallNormal = new Vector(-leftWallDirection.y, leftWallDirection.x);
    return leftWallNormal;
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

function swapVelocities(rect1,rect2){
    const tempVx = rect1.velX;
    const tempVy = rect1.velY;
    rect1.velX = rect2.velX;
    rect1.velY = rect2.velY;
    rect2.velX = tempVx;
    rect2.velY = tempVy;
}

function centerOfMassRect(rect){
    const rectVertices = rect.getVertices();
    const rectPosition = new Vector(mouseXGame,mouseYGame);
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
    const centerPointt = new Vector(centerX, centerY);

    // Translate the center point
    let centerPoint = new Vector(centerPointt.x - rectPosition.x, centerPointt.y - rectPosition.y);
    

    // Rotate the center point
    centerPoint.rotate(rectAngle);

    // Translate the center point back to the rectangle's position
    const centerOfMass = new Vector(centerPoint.x + rectPosition.x, centerPoint.y + rectPosition.y);
    
    return centerOfMass;
}

function overlapAvoidance(rect1,rect2,nx,ny){
    // separate the rectangles along the collision normal
    const overlap = (rect1.width + rect2.width) / 2 - Math.abs(nx);
    rect1.x -= overlap * nx / (nx * nx + ny * ny);
    rect1.y -= overlap * ny / (nx * nx + ny * ny);
    rect2.x += overlap * nx / (nx * nx + ny * ny);
    rect2.y += overlap * ny / (nx * nx + ny * ny);
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