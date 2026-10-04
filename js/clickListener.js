const specifiedElement = document.getElementById("linksContainer");
const domainThomasDonn = document.location.href.indexOf("thomasdonn.com") >= 0;
const headerOhThomas1 = document.getElementById("anchor-ohthomas1"); /* mario */
const headerOhThomas2 = document.getElementById("anchor-ohthomas2"); /* oh */
const headerOhThomas3 = document.getElementById("anchor-ohthomas3"); /* thomas */
const headerThomasDonn1 = document.getElementById("anchor-thomasdonn1"); /* thomas */
const headerThomasDonn2 = document.getElementById("anchor-thomasdonn2"); /* donn */
var mouseDown = 0;

var clickTimeout;

function headerCollision(event){
    // Thomas Donn mapping
    return (domainThomasDonn ? 
    headerThomasDonn1.contains(event.target) || headerThomasDonn2.contains(event.target)
    : 
    // Oh Thomas mapping
    headerOhThomas1.contains(event.target) ||
    headerOhThomas2.contains(event.target) || headerOhThomas3.contains(event.target));
}

// I'm using "click" but it works with any event
// document.addEventListener('click', event => {
document.addEventListener('mouseup', event => {
    // if(event.button == 0){ // left mouse click
    if(mouseDown == 1){
        const starBuildUpAmountTemp = starBuildUpAmount;
        resetStarBuildUp();
        mouseDown = 0;
        const isClickInside = specifiedElement.contains(event.target);
        const isClickInsideHeaderMap = headerCollision(event);

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
        const isClickInsideHeaderMap = headerCollision(event);

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