var gameCategoryImage = document.getElementById("gameTypeHolderImage");
let gameListType = 0;

function removeElement(e){
    const element = document.getElementById(e);
    element.remove();
}

function resetGameText(){
    const linkCon = document.getElementById("linksContainer");
    // linkCon.removeChild("gameTextDiv");
    removeElement("gameTextDiv");
    const tempEle = document.createElement("div");
    tempEle.id = "gameTextDiv";
    linkCon.appendChild(tempEle);
}

function resetGameList(gameList){
    for(let i = 0; i < gameList.length; i++){
        gameList[i].src = "";
        // gameList[i].id = "";
        // gameList[i].remove();
    }
}

document.getElementById('browserGames').onclick = function(){
    if(gameListType == 0)
        return;
    gameListType = 0;
    
    gameCategoryImage.src = "images/browsergames.png";
    
    removeElement("leavingSiteIcon");
    // const tempImg = document.getElementById("links");
    removeElement("leavingSiteIconDiv");
    
    const parent = document.getElementById("linksContainer");
    
    // parent.removeChild(parent.firstChild);
    
    const tempImg = document.createElement("img");
    const aTag = document.createElement('a');      // creating <a> to wrap links in so they are centered
    // aTag.draggable = false;
    aTag.appendChild(tempImg);
    parent.appendChild(aTag);
    
    var gameList = document.getElementById("linksContainer").getElementsByTagName("img");
    resetGameList(gameList);
    
    gameList[0].src = "images/javalava.png";
    gameList[0].width = 288;
    gameList[0].height = 64;
    gameList[0].alt = "Java Lava";
    gameList[0].href = "";
    gameList[0].a = "";
    gameList[0].id = "javaLavaGameButton";//"links";
    gameList[0].draggable = false;
    gameList[0].classList.remove("btn");
    gameList[0].classList.add("btnJavaLava");
    // gameList[0].onclick = function() { createJavaLavaGame(); }
    parent.firstElementChild.removeAttribute("href");
    
    resetGameText();

    document.getElementById("javaLavaGameButton").addEventListener("click", createJavaLavaGame);
    document.getElementById("linksContainer").style.paddingTop = "0px";
};

document.getElementById('downloadableGames').onclick = function(){
    if(gameListType == 1)
        return;
    gameListType = 1;

    errorTextOpacity = 0;
    removeGameText(); // for error case
    checkJavaLavaStarting();
    
    gameCategoryImage.src = "images/downloadablegames.png";
    
    document.getElementById("javaLavaGameButton").removeEventListener("click", createJavaLavaGame);

    var gameList = document.getElementById("linksContainer").getElementsByTagName("img");
    resetGameList(gameList);
    
    const parent = document.getElementById("linksContainer");
    let divTemp = document.createElement("div");
    // divTemp.display = "inline-block";
    // divTemp.flexDirection = "row";
    // divTemp.style.alignItems = "center";
    // divTemp.style.justifyContent = "center";
    divTemp.id = "leavingSiteIconDiv";
    divTemp.style = "display: inline-block; flex-direction: row; align-items: center; justify-content: center;";
    // parent.appendChild(divTemp);
    // const divParent = parent.getElementByID
    
    gameList[0].src = "images/koopasinvaders.png";
    gameList[0].width = 276;
    gameList[0].height = 128;
    gameList[0].alt = "Koopas Invaders!";
    gameList[0].id = "kiButton";//"links";
    gameList[0].draggable = false;
    gameList[0].classList.remove("btnJavaLava");
    gameList[0].classList.add("btn");
    // gameList[0].onclick = "";
    
    let leavingSiteTemp = document.createElement("img");
    
    leavingSiteTemp.src = "images/leavingsiteicon.png";
    leavingSiteTemp.width = 22;
    leavingSiteTemp.height = 22;
    leavingSiteTemp.alt = "Leaving site";
    leavingSiteTemp.id = "leavingSiteIcon";
    leavingSiteTemp.draggable = false;
    
    parent.firstElementChild.href = "https://oh-thomas.itch.io/koopas-invaders";
    parent.firstElementChild.draggable = false;
    
    divTemp.appendChild(parent.firstElementChild);// adding Koopas Invaders to this div so we can add a external link icon to it
    divTemp.appendChild(leavingSiteTemp);         // this is the external link icon
    // parent.removeChild(parent.lastChild);
    // parent.removeChild(parent.firstChild);
    parent.appendChild(divTemp);                  // this actually appends it to the html, start making new item after this (even if its external)
    
    document.getElementById("linksContainer").style.paddingTop = "32px";
    
    if(typeof running !== "undefined" && running)
        endGame();
};