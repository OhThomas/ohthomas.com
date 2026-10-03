var svgMap = new Map();
var mapID = 0;
const visitorHere = !document.URL.includes("/games");//.com/games");

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

function makeRandomColor(){
    // const random_hex_color_code = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    // let n = Math.random() * 1000000;
    // n = n + 909090;
    // n = (n* 0xfffff).toString(16);
    // console.log("random color = "+n.slice(0,6));
    return '#' + n.slice(0,6);
// };
}

// function replaceColor(color){
//     const parent = document.getElementById("svg");
//     // if(parent.children.length > 0)
//     //     parent.children.removeChild(0);
//     // parent.removeAttribute("style");
//     // parent.style.webkitTextFillColor(color);
//     // parent.classList.remove('style');
//     // parent.remove('style');
//     // var styleNode; //= parent.children.styleNode;//document.createElement("style");
//     // var styleNode = document.getElementsByTagName("style");
//     var styleNode = document.createElement("style");//parent.getElementsByTagName('style');


//     // styleNode[0].remove();
//     // var styleNode = document.getElementById('style');
//     styleNode.polygon = null;
//     // styleNode.type = "text/css";
//     // let cssTextReplace = 'polygon { stroke: ${color}; fill: ${color}; position: absolute; z-index: 1; flex: none; }';
//     let cssTextReplace = 'polygon { stroke: '+color+'; fill: '+color+'; position: absolute; z-index: 1; flex: none; }';
//     // browser detection (based on prototype.js)
//     if(!!(window.attachEvent && !window.opera)) {
//         styleNode.styleSheet.cssText = cssTextReplace;
//     } else {
//     var styleText = document.createTextNode(cssTextReplace);
//         // styleNode.appendChild(styleText);
//         // styleNode.appendChild(styleText);  // this takes up a lot of processing power
//         styleNode.appendChild(styleText);
//         // styleNode.styleText = styleText;
//         // parent.appendChild(styleNode);
//         // parent.style = styleNode;
//         parent.children.styleText = styleNode;
//     }
// }

// function replaceColor(color){
//     const svg = document.getElementById("svg");
//     svg.style.color = color;
// }

function createStars(starBuildUpAmount,color)
{
    // const linksHeight = document.getElementById("linksContainer").getBoundingClientRect().height;
    // const headerHeight = document.getElementById("headerimg").getBoundingClientRect().height;
    // const height = 110;
    // console.log("HERE height = "+linksHeight + " header height = "+headerHeight);
    
    var svg = document.getElementById("svg");
    var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.style.stroke = color;
    polygon.style.fill = color;
    svg.appendChild(polygon);

    var array = arr = [ [ mouseX+0,mouseY+scrollPosition+0 ] ];
    let arrayPoints = 0;
    while (arrayPoints++ < 8+(starBuildUpAmount/2)){
        let xOffset = Math.random(60);
        let yOffset = Math.random(60);
        const xNeg = Math.random() < 0.5;
        const yNeg = Math.random() < 0.5;
        if (xNeg)
            xOffset *= -1
        if (yNeg)
            yOffset *= -1
        let arrn = [mouseX+(xOffset*6),mouseY+scrollPosition+(yOffset*6)];
        array.push(arrn);
    }
    // var array = arr = [ [ mouseX+0,mouseY+0 ], 
             // [ mouseX+50,mouseY-25 ],
             // [ mouseX+25,mouseY+25 ], ];
    // var arrn = [mouseX+37,mouseY-35];
    // array.push(arrn);
    // var arrn = [mouseX-17,mouseY+15];
    // array.push(arrn);
    // var arrn = [mouseX+22,mouseY-32];
    // array.push(arrn);
    // var arrn = [mouseX+7,mouseY-35];
    // array.push(arrn);
    // console.log("array = "+array);

    for (value of array) {
        var point = svg.createSVGPoint();
        point.x = value[0];
        point.y = value[1];
        polygon.points.appendItem(point);
    }
    
    // let colorr = makeRandomColor();
    // replaceColor(colorr);
    
    let svgChildPlacement = svg.children.length-1;//-1;
    // for (stars in svg.children)
    // {
        // if(isInt(stars)){
            // svgChildPlacement++;
        // }
    // }
    svgMap.set(mapID,svgChildPlacement);
    
    
    let velXRand = Math.random(60);
    let velYRand = Math.random(60);
    const velXNeg = Math.random() < 0.5;
    const velYNeg = Math.random() < 0.5;
    if (velXNeg)
        velXRand *= -1
    if (velYNeg)
        velYRand *= -1
    
    let myID = mapID++;
    let x = 0;
    let y = 0;//-0.1;
    let velX = velXRand*6.66+(0.24*velXRand*starBuildUpAmount);//7.2;
    let velY = velYRand*6.66+(0.24*velYRand*starBuildUpAmount);//7.2;
    let opacity = 1;
    // let colorInterval = setInterval(function(){
        // let colorr = makeRandomColor();
        // replaceColor(colorr);
    // }, 150);
    let velocityInterval = setInterval(function(){
        svgChildPlacement = svgMap.get(myID);
        //BOUNDING BOX
        // if(myID == 0)
            // console.log("bounding box = "+svg.children[svgChildPlacement].getBoundingClientRect().x);
        //BOUNDING BOX
        if(svgChildPlacement < 0 || svg.children[svgChildPlacement] == null){
            // [...svgMap.keys()].forEach((key) => {
                // const newValue = svgMap.get(key) - 1;
                // svgMap.set(key, newValue);
            // });
            if(svg.children[0] != null && isInt(svg.children[0]))
                svg.children[0].remove();
            // clearInterval(colorInterval);
            clearInterval(velocityInterval);
        }
        else{
            x = x+velX;//-0.1;
            y = y+velY;//-0.1;
            opacity = opacity - 0.02;
            let transformAttr = ' translate(' + x + ',' + y + ')';
            svg.children[svgChildPlacement].setAttribute('transform', transformAttr);
            svg.children[svgChildPlacement].setAttribute("opacity",opacity);
            
            if(visitorHere){
                let visitorImg = document.getElementById("visitor");
                let visitorLeft = visitorImg.getBoundingClientRect().x;
                let visitorTop = visitorImg.getBoundingClientRect().y;
                let visitorRight = visitorLeft+40;
                let visitorBottom = visitorTop+18;
                
                // console.log("visitorIMG = "+visitorImg.getImageData());
                // let visitorRight = visitorX-40;
                // let visitorBottom = visitorY-18;
                
                // console.log("Collision check lx1 = "+svg.children[svgChildPlacement].getBoundingClientRect().x+
                // " ly1 = "+svg.children[svgChildPlacement].getBoundingClientRect().y+
                // " rx1 = "+svg.children[svgChildPlacement].getBoundingClientRect().right+
                // " ry1 = "+svg.children[svgChildPlacement].getBoundingClientRect().bottom+
                // " lx2 = "+visitorX+" ly2 = "+visitorY+" rx2 = "+ visitorRight+ " ry2 = "+visitorBottom);
                //DO COLLISION
                if(collision(svg.children[svgChildPlacement].getBoundingClientRect().x,
                svg.children[svgChildPlacement].getBoundingClientRect().y,
                svg.children[svgChildPlacement].getBoundingClientRect().right,
                svg.children[svgChildPlacement].getBoundingClientRect().bottom,
                visitorLeft, visitorTop, visitorRight, visitorBottom)){
                    
                // console.log("Collision check lx1 = "+svg.children[svgChildPlacement].getBoundingClientRect().x+
                // " ly1 = "+svg.children[svgChildPlacement].getBoundingClientRect().y+
                // " rx1 = "+svg.children[svgChildPlacement].getBoundingClientRect().right+
                // " ry1 = "+svg.children[svgChildPlacement].getBoundingClientRect().bottom+
                // " lx2 = "+visitorLeft+" ly2 = "+visitorTop+" rx2 = "+ visitorRight+ " ry2 = "+visitorBottom);
                    // console.log("ALIEN HIT");
                    alienCollision();
                }
            }
            
            // if(svg.children[svgChildPlacement].getBoundingClientRect().x
            
            if (opacity <= 0.1){
                [...svgMap.keys()].forEach((key) => {
                    let newValue = svgMap.get(key) - 1;
                    if(newValue < 0)
                        newValue = 0;
                    svgMap.set(key, newValue);
                });
            
                svg.children[svgChildPlacement].parentNode.removeChild(svg.children[svgChildPlacement]);
                if(1 < svg.children.length && (svg.children[svgChildPlacement] == null || svg.children[svgChildPlacement].children <=1))
                    svg.removeChild(0);
                // clearInterval(colorInterval);
                clearInterval(velocityInterval);
            }
        }
    },10);
}

function starExplosion(starBuildUpAmount)
{
    // let delta = Date.now() - externalTimer;
    // if(delta / 1000 < 0.5)//0.5)
        // return;
    
    // externalTimer = Date.now();
    let howManyStars = svg.children.length;//0;
    // for (stars in svg.children)
    // {
        // if(isInt(stars)){
            // howManyStars++;
            // console.log("hey the = "+stars);
        // }
    // }
    if(howManyStars == 0)
        svgMap.clear();
    else if(howManyStars > 30)
        return;
    
    // while(howManyStars-- > 25){
        // svg.children[0].parentNode.removeChild(svg.children[0]);
    // }
    
    
    
    let colorr = makeRandomColor();
    // replaceColor(colorr);
    
    let starCount = 0;
    let starAmount = 8;
    while(starCount++ < starAmount+starBuildUpAmount)
    {
        createStars(starBuildUpAmount,colorr);
    }
}