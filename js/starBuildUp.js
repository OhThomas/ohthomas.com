var starBuildUpAmount = 0;
let animationOffset = 13;
let buildUpInterval;
function resetStarBuildUp(){
    resetAnimation("starBuildUp","sbuAnimation");
    setOpacity("starBuildUp","0");
    starBuildUpAmount = 0;
    clearInterval(buildUpInterval);
}
function moveStarBuildUp(x,y){
    moveAnimation("starBuildUp",x-animationOffset,y-animationOffset);
}
function starBuildUp(){
    setOpacity("starBuildUp","0.5");
    // document.getElementById('starBuildUp').style.marginLeft = mouseX-13;//x-11;
    // document.getElementById('starBuildUp').style.marginTop = mouseY-13;//y-7;
    // document.getElementById('starBuildUp').classList.add('sbuAnimation');
    setAnimation("starBuildUp","sbuAnimation",mouseX-animationOffset,mouseY-animationOffset);
    document.getElementById('starBuildUp').addEventListener('webkitAnimationEnd', function(){
        this.style.webkitAnimationName = '';
        this.classList.remove('sbuAnimation');
    }, false);
    buildUpInterval = setInterval(function(){
        if(starBuildUpAmount < 24){
            starBuildUpAmount++;
            console.log("starBuildUpAmount = "+starBuildUpAmount);
        }
    },83.334);// 24 * 83.334(ms) gets close to 2 seconds
}