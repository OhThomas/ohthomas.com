const specifiedElement = document.getElementById("linksContainer");
const dropdownElement = document.getElementById("gameLinkTypes");
const headerImgMap = (document.URL.includes("www.thomasdonn.com")) ? document.getElementById("thomasdonnmap") : document.getElementById("ohthomasmap");
var mouseDownOutCanvas = 0;
setListener();

function getCanvas(){
    return document.getElementById('canvas');
}

var clickTimeout;

function setListener(){
    // I'm using "click" but it works with any event
    // document.addEventListener('click', event => {
    document.addEventListener('mouseup', event => {
        // if(event.button == 0){ // left mouse click
        if(mouseDownOutCanvas == 1){
            const starBuildUpAmountTemp = starBuildUpAmount;
            resetStarBuildUp();
            mouseDownOutCanvas = 0;
            const isClickInside = specifiedElement.contains(event.target);
            const isClickInsideCanvas =  (getCanvas() == undefined) ? false : getCanvas().contains(event.target);
            const isClickInsideHeaderMap = headerImgMap.contains(event.target);
            const isClickInsideDropdownMenu = dropdownElement.contains(event.target);

            if (!isClickInside && !isClickInsideCanvas && !isClickInsideHeaderMap && !isClickInsideDropdownMenu) {
                starExplosion(starBuildUpAmountTemp);
            }
        }
    })
    document.addEventListener('mousedown', event => {
        if(event.buttons == 1){ // left mouse click
            const isClickInside = specifiedElement.contains(event.target);
            const isClickInsideCanvas = (getCanvas() == undefined) ? false : getCanvas().contains(event.target);
            const isClickInsideHeaderMap = headerImgMap.contains(event.target);
            const isClickInsideDropdownMenu = dropdownElement.contains(event.target);
            if (!isClickInside && !isClickInsideCanvas && !isClickInsideHeaderMap && !isClickInsideDropdownMenu) {
                mouseDownOutCanvas = 1;
                clearInterval(clickTimeout);
                clickTimeout = setTimeout( function() {
                    if(mouseDownOutCanvas == 1){
                        starBuildUp();
                    }
                }, 360);
            }
        }
    })
}