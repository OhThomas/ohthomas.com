var camera = { x: 0, y: 0 };

function cameraTick(){
    camera.y = character1.y-(canvas.height/2);
    if(camera.y >= 0)
        camera.y = 0;
}