var svgBackgroundMap = new Map();
var svgBackgroundMapID = 0;

function createBackgroundStar(color){
    const svgBackground = document.getElementById("svgBackground");
    let polygonBackground = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    polygonBackground.style.stroke = color;
    polygonBackground.style.fill = color;
    polygonBackground.style.width = polygonBackground.style.height = 1+(Math.random()* 10)/2;
    
    const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
    polygonBackground.style.x = width*4 * Math.random()+"px";//Firefox needs the "px"
    polygonBackground.style.y = height*4 * Math.random()+"px";//Firefox needs the "px"
    svgBackground.appendChild(polygonBackground);
    
    let svgChildPlacement = svgBackground.children.length-1;
    svgBackgroundMap.set(svgBackgroundMapID,svgChildPlacement);
}

function createBackgroundStars(){
    // replaceColor(colorr);
    const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
    const scaleMod = (width+height)/(1920+1080);

    for(let i = 0; i < (150*scaleMod)+Math.random()*20; i++){
        let colorr = makeRandomColor();
        createBackgroundStar(colorr);
    }
}
createBackgroundStars(); // called when initiated