var image = document.getElementById("visitor");
var start = Date.now();
var visitorX = -40; /* make random */
var visitorY = 0; /* make random */
var visitorXDest = 0;
var visitorYDest = 0;
var velX = 0;
var velY = 0;
var maxVelocity = 1;
var visitorRunAway = 0;
var secondsBeforeArriving = 10;//10;
var stationaryInterval;
var circlingInterval;
var movingInterval;
var waitingTimer;
var dead = 0;
function alienCollision(){
    if(dead == 1 || image.getBoundingClientRect().x <= -30 || image.getBoundingClientRect().y <= -20)
        return;
    dead = 1;
    maxVelocity = 0;
    if(visitorXDest < visitorX)
        velX = -0.2;
    else
        velX = 0.2;
    if(visitorYDest < visitorY)
        velY = -0.2;
    else
        velY = 0.2;
    image.src = "images/ufoaliendyingonce.gif";
    
    // CSS explosion
    // document.getElementById('circleExplosion').style.marginLeft = image.getBoundingClientRect().x-16;//x-11;
    // document.getElementById('circleExplosion').style.marginTop = image.getBoundingClientRect().y-18;//y-7;
    // document.getElementById('circleExplosion').classList.add('ceAnimation');
    setAnimation("circleExplosion","ceAnimation",image.getBoundingClientRect().x-16,image.getBoundingClientRect().y-18);
    // document.getElementById('circleInnerExplosion').style.marginLeft = image.getBoundingClientRect().x-12;
    // document.getElementById('circleInnerExplosion').style.marginTop = image.getBoundingClientRect().y-22;
    // document.getElementById('circleInnerExplosion').classList.add('cieAnimation');
    setAnimation("circleInnerExplosion","cieAnimation",image.getBoundingClientRect().x-12,image.getBoundingClientRect().y-22);
    
    clearInterval(waitingTimer);
    setTimeout( function() {
        clearInterval(stationaryInterval);
        clearInterval(circlingInterval);
        clearInterval(movingInterval);
    }, 2000);
}

function clamp(number, min, max){
    if (number >= max)
        return number = max;
    else if(number <= min)
        return number = min;
    else
        return number;
}

function mousePositionVisitorWatch(e)
{
    if(dead == 1){
        clearInterval(stationaryInterval);
        clearInterval(circlingInterval);
        clearInterval(waitingTimer);
        return;
    }
    
    start = Date.now();
    clearInterval(stationaryInterval);
    clearInterval(circlingInterval);
    clearInterval(waitingTimer);
    // SEND AWAY VISITOR
    if(visitorRunAway == 1){
        visitorXDest = -200;
        visitorYDest = -100;
        if(visitorXDest < visitorX)
            velX = -0.1;
        else
            velX = 0.1;
        if(visitorYDest < visitorY)
            velY = -0.1;
        else
            velY = 0.1;
        visitorRunAway = 0;
    }
    // SET TIMER 
    else{
        waitingTimer = setInterval(function(){
            var delta = Date.now() - start; // milliseconds elapsed since start
            if(visitorRunAway == 1)
                clearInterval(waitingTimer);
            else if(Math.floor(delta / 1000) > secondsBeforeArriving){
                // <!-- console.log("here!"); -->
                visitorRunAway = 1;
                // var scrollPosition = document.body.scrollTop;   // or document.documentElement.scrollTop
                visitorXDest = (e.x-(image.width/2)-26);
                visitorYDest = (e.y-235 + scrollPosition);
                if(visitorXDest < visitorX)
                    velX = -0.1;
                else
                    velX = 0.1;
                if(visitorYDest < visitorY)
                    velY = -0.1;
                else
                    velY = 0.1;
                
                image.style.marginLeft = visitorX+"px";
                image.src = "images/ufoalienslower.gif";
                // image.alt = "visitor";          // this makes him not interrupt the cursor highlighting links
                
                var visitorXDestSrc = visitorXDest + 2;
                var visitorYDestSrc = visitorYDest + 55; //- 55;
                visitorXDestSrc = clamp(visitorXDestSrc,0,window.innerWidth);
                visitorYDestSrc = clamp(visitorYDestSrc,0,window.innerHeight);
                var rotation = 0;
                var secondTimeCapture = start;
                
                //Stationary movement
                stationaryInterval = setInterval(function(){
                    if(velX == 0 && velY == 0){
                        switch(rotation){
                            case 0:
                                visitorX -= 3;
                                visitorY -= 3;
                                rotation++;
                                break;
                            case 1:
                                rotation++;
                                visitorX -= 3;
                                visitorY += 3;
                                break;
                            case 2:
                                rotation++;
                                visitorX += 3;
                                visitorY += 3;
                                break;
                            default:
                                rotation = 0;
                                visitorX += 3;
                                visitorY -= 3;
                                break;
                        }
                        image.style.marginLeft = visitorX+"px";
                        image.style.marginTop = visitorY+"px";
                    }
                    if(visitorRunAway == 0)
                        clearInterval(stationaryInterval);
                },200);
                
                //Circling around cursor movement
                circlingInterval = setInterval(function(){
                    var xOffset = Math.random(60);
                    var yOffset = Math.random(60);
                    var xNeg = Math.random() < 0.5;
                    var yNeg = Math.random() < 0.5;
                    if (xNeg)
                        xOffset *= -1
                    if (yNeg)
                        yOffset *= -1
                    visitorXDest = visitorXDestSrc + xOffset*60;
                    visitorYDest = visitorYDestSrc + yOffset*60;
                    if(visitorXDest < visitorX)
                        velX = -0.1;
                    else
                        velX = 0.1;
                    if(visitorYDest < visitorY)
                        velY = -0.1;
                    else
                        velY = 0.1;
                    console.log("visitorXDest = "+visitorXDest+" visitorXDestSrc = "+visitorXDestSrc+" xoffset = "+xOffset);
                    
                    if(secondTimeCapture != start && visitorX <= -50){
                        clearInterval(stationaryInterval);
                        clearInterval(circlingInterval);
                    }
                },5000);
                    
                //Velocity movement (what actually moves it)
                movingInterval = setInterval(function(){
                    if(dead == 0){
                        if(velX != 0 && (velX < maxVelocity && velX > maxVelocity*-1)){
                            velX += velX/10;
                        }
                        if(velY != 0 && (velY < maxVelocity && velY > maxVelocity*-1)){
                            velY += velY/10;
                        }
                    }
                    else{
                        if(velX != 0)
                            velX -= velX/66;
                        if(velY != 0)
                            velY -= velY/66;
                    }
                    
                    if((velX > 0 && visitorX < visitorXDest) || (velX < 0 && visitorX > visitorXDest)){
                        visitorX += velX * 6;
                    }
                    else{
                        velX = 0;
                    }
                    if((velY > 0 && visitorY < visitorYDest) || (velY < 0 && visitorY > visitorYDest)){
                        visitorY += velY * 6;
                    }
                    else{
                        velY = 0;
                    }
                    image.style.marginLeft = visitorX+"px";
                    image.style.marginTop = visitorY+"px";
                    
                    if(dead == 1){
                        // document.getElementById('circleExplosion').style.marginLeft = image.getBoundingClientRect().x-16;
                        // document.getElementById('circleExplosion').style.marginTop = image.getBoundingClientRect().y-18;
                        moveAnimation("circleExplosion",image.getBoundingClientRect().x-16,image.getBoundingClientRect().y-18);
                        // document.getElementById('circleInnerExplosion').style.marginLeft = image.getBoundingClientRect().x-12;
                        // document.getElementById('circleInnerExplosion').style.marginTop = image.getBoundingClientRect().y-22;
                        moveAnimation("circleInnerExplosion",image.getBoundingClientRect().x-12,image.getBoundingClientRect().y-22);
                    }
                    
                    if(secondTimeCapture != start && visitorX <= -150){
                        clearInterval(stationaryInterval);
                        clearInterval(circlingInterval);
                        clearInterval(movingInterval);
                    }
                },10);
                clearInterval(waitingTimer);
            }
        },1000);
    }
}