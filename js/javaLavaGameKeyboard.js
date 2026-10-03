// Initialize keyboard controls
const keys = {};
window.addEventListener('keydown', event => {
    keys[event.keyCode] = true;
});
window.addEventListener('keyup', event => {
    releasedInputs(event);
    keys[event.keyCode] = false;
});

function releasedInputs(e){
    if(!running)
        return;
    if (e.keyCode == 80 || e.keyCode == 27){ // P and Escape keys
        paused = !paused;
        if(paused)
            renderPaused();
        else
            clearInterval(pausedFeedbackInterval);
    }
    // if (keys[16]){  // Shift key
    //     if(character1.rotationLock)
    //         character1.rotationLock = false;
    // }
}

function input(){
    if(!running)
        return;

    // if (keys[65]) { // A key
    //     velXT(character1,-1)
    // } else if (keys[68]) { // D key
    //     velXT(character1,1)
    // } if (keys[87]) { // W key
    //     velYT(character1,-1)
    // } else if (keys[83]) { // S key
    //     velYT(character1,1)
    // }
    
    // if (keys[16]){ // Shift key
    //     character1.reOrient();
    //     character1.rotationLock = true;
    // }
}