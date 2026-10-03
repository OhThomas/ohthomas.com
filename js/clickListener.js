const specifiedElement = document.getElementById("linksContainer");
const headerImgMap = ((document.location.href.indexOf("www.thomasdonn.com") >= 0) ? document.getElementById("thomasdonnmap") : document.getElementById("ohthomasmap"));
var mouseDown = 0;

var clickTimeout;
// I'm using "click" but it works with any event
// document.addEventListener('click', event => {
document.addEventListener('mouseup', event => {
    // if(event.button == 0){ // left mouse click
    if(mouseDown == 1){
        const starBuildUpAmountTemp = starBuildUpAmount;
        resetStarBuildUp();
        mouseDown = 0;
        const isClickInside = specifiedElement.contains(event.target);
        const isClickInsideHeaderMap = headerImgMap.contains(event.target);

        if (!isClickInside && !isClickInsideHeaderMap) {
            starExplosion(starBuildUpAmountTemp);
        }
        
        let e = new point(mouseX,mouseY);
        mousePositionVisitorWatch(e);
    }
})
document.addEventListener('mousedown', event => {
    if(event.buttons == 1){ // left mouse click
        const isClickInside = specifiedElement.contains(event.target);
        const isClickInsideHeaderMap = headerImgMap.contains(event.target);

        if (!isClickInside && !isClickInsideHeaderMap) {
            mouseDown = 1;
            clearInterval(clickTimeout);
            clickTimeout = setTimeout( function() {
                if(mouseDown == 1)
                    starBuildUp();
            }, 360);
        }
        
        let e = new point(mouseX,mouseY);
        mousePositionVisitorWatch(e);
    }
})