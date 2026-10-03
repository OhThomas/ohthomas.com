var mouseX = 0;
var mouseY = 0;
var scrollPosition = document.body.scrollTop;
setMouseEvents();

function mousePosition(e)
{
    var temp = document.getElementById("sample").content
    var copy = document.importNode(temp,true);
    copy.querySelector(".title").textContent = e.x + " " + e.y;
    mouseX = e.x;
    mouseY = e.y;
    // document.getElementById("app").innerHTML = "";
    // document.getElementById("app").appendChild(copy);
    
    moveStarBuildUp(e.x,e.y);
    if(!document.URL.includes("/games"))//".com/games))"
        mousePositionVisitorWatch(e);
}

function setMouseEvents(){
    document.addEventListener("mousemove", function(event){mousePosition(event)});

    document.addEventListener('mouseleave', event => {
        resetStarBuildUp();
        mouseDownOutCanvas = 0;
    })

    document.addEventListener('scroll', event => {
        scrollPosition = document.body.scrollTop;   // or document.documentElement.scrollTop
        moveStarBuildUp(mouseX,mouseY);
    })
}