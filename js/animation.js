function resetAnimation(className,animationName){
    const classAnim = document.getElementById(className);
    classAnim.classList.remove(animationName);
}

function setAnimation(className,animationName,x,y){
    const elementAnim = document.getElementById(className);
    elementAnim.style.marginLeft = x;
    elementAnim.style.marginTop = y+scrollPosition;
    elementAnim.classList.add(animationName);
}

function moveAnimation(className,x,y){
    const elementAnim = document.getElementById(className);
    elementAnim.style.marginLeft = x;
    elementAnim.style.marginTop = y+scrollPosition;
}

function setOpacity(className,opacity){
    const ele = document.getElementById(className);
    ele.style.opacity = opacity;
}
// setInterval(function(){
    // console.log("width = "+(Math.round(((window.outerWidth) / window.innerWidth)*100) / 100));
// },100);