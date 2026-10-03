let blackHoleRotation = 0;
let blackHoleExpansion = 1;
let blackHoleExpansionVelocity = 0.006;
const blackHoleInnerRadius = 15;
const blackHoleStreakHang = 2.5;
const blackHoleStreakRadius = 1.4;//1.3;
const blackHoleStreakCenterRadius = 2.4;
const blackHoleStreakSpeed = 0.82;
const blackHoleStreakStartLength = 1.04;//1.1;

// FX for the black hole (light streaks going towards center)
class BlackHoleStreak {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.centerX = 0;
        this.centerY = 0;
        this.velX = 0;
        this.velY = 0;
        this.xLine = 0;
        this.yLine = 0;
        this.degree = 0;
        this.radius = 0;
        this.color = "";
        this.blackHoleIndex = 0;
    }

    tick(){
        if(blackHoles[this.blackHoleIndex] == undefined || blackHoles[this.blackHoleIndex].streaks == undefined)
            return;

        if(!(Math.abs(this.x-this.centerX) <= 1))
            this.x +=this.velX;
        if(!(Math.abs(this.xLine-this.centerX) <= 1))
            this.xLine += this.velX/blackHoleStreakHang;
        if(!(Math.abs(this.y-this.centerY) <= 1))
            this.y +=this.velY;
        if(!(Math.abs(this.yLine-this.centerY) <= 1))
            this.yLine += this.velY/blackHoleStreakHang;

        // Removing
        if(Math.abs(this.xLine-this.centerX) <= 1 && Math.abs(this.yLine-this.centerY) <= 1){
            const index = blackHoles[this.blackHoleIndex].streaks.indexOf(this);
            blackHoles[this.blackHoleIndex].streaks.splice(index,1);
        }
    }

    render(){
        context.strokeStyle = this.color;
        context.fillStyle = this.color;

        const newX = this.x-camera.x;//x+(xLine)-camera.x;
        const newY = this.y-camera.y;//y+(yLine)-camera.y;

        context.beginPath();

        context.moveTo(newX,newY);
        context.lineTo(this.xLine-camera.x,this.yLine-camera.y);
        
        context.stroke();
        context.closePath();
    }
}

class BlackHole {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.velX = 0;
        this.velY = 0;
        this.radius = 100;
        this.rotation = 0;
        this.expansion = 1;
        this.expansionVelocity = 0.006;
        this.streaks = [];
        this.vertices = [];
        this.edges = [];
        this.innerBlackHole = null;
    }

    remove(){
        if(this.innerBlackHole != null){
            this.innerBlackHole.streaks = [];
            this.innerBlackHole.vertices = [];
            this.innerBlackHole.edges = [];
        }
        this.streaks = [];
        this.vertices = [];
        this.edges = [];
        const index = blackHoles.indexOf(this);
        blackHoles.splice(index,1);
    }

    createVertices(){
        this.vertices = [];
        const numPoints = 32; // number of points to generate
        const angleIncrement = (2 * Math.PI) / numPoints; // angle between each point

        for (let i = 0; i < numPoints; i++) {
            const angle = i * angleIncrement;
            const xTemp = this.x + this.radius * Math.cos(angle);
            const yTemp = this.y + this.radius * Math.sin(angle);
            const vert = new Vector(xTemp,yTemp);
            this.vertices.push(vert);
        }
        this.createEdges();
    }

    createEdges(){
        this.edges = [];
        for (let i = 0; i < this.vertices.length; i++) {
            const j = (i + 1) % this.vertices.length;
            const edge = new Vector(this.vertices[j].x - this.vertices[i].x, this.vertices[j].y - this.vertices[i].y);
            this.edges.push(edge);
        }
    }

    getVertices(){
        return this.vertices;
    }

    getEdges() {
        return this.edges;
    }

    createStreak(){
        const blackHoleStreakTemp = new BlackHoleStreak();
        const randDegree = getRandomIntInclusive(0,359);
        const index = blackHoles.indexOf(this);
        const radiusTemp = 50;
        const xLineTemp = this.x + ((blackHoleStreakStartLength*radiusTemp)*blackHoleStreakRadius*(Math.cos(randDegree)));
        const yLineTemp = this.y + ((blackHoleStreakStartLength*radiusTemp)*blackHoleStreakRadius*(Math.sin(randDegree)));

        blackHoleStreakTemp.x = this.x + ((radiusTemp)*blackHoleStreakRadius*(Math.cos(randDegree)));
        blackHoleStreakTemp.y = this.y + ((radiusTemp)*blackHoleStreakRadius*(Math.sin(randDegree)));
        blackHoleStreakTemp.centerX = this.x + (radiusTemp/blackHoleStreakCenterRadius*(Math.cos(randDegree)));//1.8
        blackHoleStreakTemp.centerY = this.y + (radiusTemp/blackHoleStreakCenterRadius*(Math.sin(randDegree)));
        blackHoleStreakTemp.xLine = xLineTemp;
        blackHoleStreakTemp.yLine = yLineTemp;
        blackHoleStreakTemp.degree = randDegree;
        blackHoleStreakTemp.radius = radiusTemp;
        blackHoleStreakTemp.color = "#FAFAFA";
        blackHoleStreakTemp.blackHoleIndex = index;
        blackHoleStreakTemp.velX = blackHoleStreakSpeed*Math.abs(Math.cos(randDegree));
        blackHoleStreakTemp.velY = blackHoleStreakSpeed*Math.abs(Math.sin(randDegree));

        if(blackHoleStreakTemp.centerX < blackHoleStreakTemp.x)
            blackHoleStreakTemp.velX *= -1;
        if(blackHoleStreakTemp.centerY < blackHoleStreakTemp.y)
            blackHoleStreakTemp.velY *= -1;

        this.streaks.push(blackHoleStreakTemp);
    }

    streakRender(color,radius){
        context.strokeStyle = color;
        context.fillStyle = color;

        const randDegree = getRandomIntInclusive(0,359);
        const xLine = (radius*2*(Math.cos(randDegree)));
        const yLine = (radius*2*(Math.sin(randDegree)));
        const newX = this.x-camera.x;//x+(xLine)-camera.x;
        const newY = this.y-camera.y;//y+(yLine)-camera.y;
    
        context.beginPath();
        context.moveTo(newX,newY);
        context.lineTo(newX+xLine,newY+yLine);
        context.stroke();
        context.closePath();
    }

    lightRender(color,offset,crest,amount){
        
        context.strokeStyle = color;//"#FAFAFA";
        context.fillStyle = color;//"#FAFAFA";

        context.beginPath();
        context.save();
        context.translate(this.x-camera.x,this.y-camera.y);
        context.rotate(this.rotation+offset);
        for(let angle = 0; angle <2*Math.PI;angle+=0.01){
            let centerX = (crest/this.expansion)*Math.cos(amount*angle)*Math.cos(angle);
            let centerY = (crest/this.expansion)*Math.cos(amount*angle)*Math.sin(angle);
            context.lineTo(centerX,centerY);
        }
        context.fill();
        context.restore();
        context.closePath();
    }

    render(){
        const tempStroke = context.strokeStyle;
        const tempFill = context.fillStyle;
        const tempShadowBlur = context.shadowBlur;
        const tempShadowColor = context.shadowColor;
        const maxRadius = 50;//100
    
        for(let i = 0; i < this.streaks.length; i++){
            this.streaks[i].render();
        }
        this.lightRender("#FAFAFA",0,maxRadius,1116);
        this.lightRender("#00E9FF",0.2,maxRadius-10,200);
        context.strokeStyle = "#222222";
        context.fillStyle = "#222222";
        context.shadowBlur = blackHoleInnerRadius;//15;
        context.shadowColor = "#FAFAFA";
        let radius = blackHoleInnerRadius;//15;
        context.beginPath();
        const cameraX = camera.x;
        const cameraY = camera.y;
    
        context.arc(this.x-cameraX,this.y-cameraY,radius,0,2*Math.PI);
    
        context.closePath();
        context.stroke();
        context.fill();
        context.shadowBlur = tempShadowBlur;
        context.shadowColor = tempShadowColor;
    
        context.strokeStyle = tempStroke;
        context.fillStyle = tempFill;
    }

    tick(){
        this.rotation+= 0.007;
        if(this.rotation > Math.PI * 2)
            this.rotation = 0;
    
        this.expansion += this.expansionVelocity;
        if(this.expansion > 2.5 || this.expansion <= 1)
            this.expansionVelocity*=-1;

        if(getRandomIntInclusive(0,160) == 6){
            this.createStreak();
        }

        for(let i = 0; i < this.streaks.length; i++){
            this.streaks[i].tick();
        }
            
        if(lavaY + canvas.height < this.y - (this.radius)){
            this.remove();
        }
    }
}

function createBlackHole(x,y){
    // Setting parameters
    let tempX = x;
    if(x == -1)
        tempX = getRandomIntInclusive(0+blackHoleInnerRadius,canvas.width-blackHoleInnerRadius);
    let tempY = y;
    if(y == -1)
        tempY = getRandomIntInclusive(0,canvas.height);
    tempY = spawnPlatformY-(canvas.height/2)-200-tempY;
    
    // Creating objects
    let tempBlackHole = new BlackHole();
    tempBlackHole.x = tempX;
    tempBlackHole.y = tempY;
    tempBlackHole.createVertices();
    const innerBlackHole = new BlackHole();
    innerBlackHole.x = tempX;
    innerBlackHole.y = tempY;
    innerBlackHole.radius = blackHoleInnerRadius;
    innerBlackHole.createVertices();
    tempBlackHole.innerBlackHole = innerBlackHole;
    blackHoles.push(tempBlackHole);
}

function resetBlackHoles(){
    for(let i = 0; i < blackHoles.length; i++){
        blackHoles[i].streaks = [];
        blackHoles[i].vertices = [];
        blackHoles[i].edges = [];
        blackHoles[i].innerBlackHole.vertices = [];
        blackHoles[i].innerBlackHole.edges = [];
    }
    blackHoles = [];
}