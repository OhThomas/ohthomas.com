let running = false;

function startGame() {
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        if(running)
            return;
        running = true;
        console.log("running");
        this.canvas.width = 640;
        this.canvas.height = 360;
        this.canvas.style.position = 'relative';
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
    }
}