const domainName = "";//"http://localhost:9500/";
const javaLavaDownloadTotal = 15;
const loadTimeout = 10000;
let javaLavaGameDownloadInterval;
let downloadErrorInterval;
var errorTextOpacity = 0;
let javaLavaLoadCount = 0;
let javaLavaStarting = false;
let scriptsLoaded = [];
var gameText;

const options = {
    method: "get",
    type: 'text/javascript'
};

// document.getElementById('blueGameButton').onclick = createJavaLavaGame;
document.getElementById("javaLavaGameButton").addEventListener("click", createJavaLavaGame);

//DEBUGGING PURPOSES
function createLocalGameScripts(srcLocation){
    const parent = document.getElementById("gameContainer");
    var ele = document.createElement('script');
    ele.src =  srcLocation;
    ele.onload = scriptLoad(srcLocation);
    parent.appendChild(ele);
}

//DEBUGGING PURPOSES
function localJavaLavaGame(fileName){
    // const dir = fileName.substring(0,fileName.length-10); // -10 for games.html
    createLocalGameScripts("js/javaLavaGameUtilities.js")
    createLocalGameScripts("js/javaLavaGameGeometry.js")
    createLocalGameScripts("js/javaLavaGameFX.js")
    createLocalGameScripts("js/javaLavaGameHUD.js")
    createLocalGameScripts("js/javaLavaGameMenu.js")
    createLocalGameScripts("js/javaLavaGameBlackHole.js")
    createLocalGameScripts("js/javaLavaGameWarningSign.js")
    createLocalGameScripts("js/javaLavaGameLava.js")
    createLocalGameScripts("js/javaLavaGamePlayer.js")
    createLocalGameScripts("js/javaLavaGamePlatform.js")
    createLocalGameScripts("js/javaLavaGamePhysics.js")
    createLocalGameScripts("js/javaLavaGameCamera.js")
    createLocalGameScripts("js/javaLavaGameKeyboard.js")
    createLocalGameScripts("js/javaLavaGame.js")
    createLocalGameScripts("js/javaLavaGameMouse.js")
}

function removeGameText(){
    if(gameText != null && gameText.parentNode != null)
        gameText.parentNode.removeChild(gameText);
}

function updateJavaLavaText(string,opacity){
    const tempText = document.getElementById("gameTextDiv");//("linksContainer");
    gameText = document.createTextNode(string);
    tempText.style.font = 60+"px KoopasInvadersFont";
    tempText.style.color = "#FF4968";//"#27BFFF";
    tempText.style.opacity = opacity;
    tempText.appendChild(gameText);
}

function updateLoadingText(){
    const percentage = Math.ceil((100/javaLavaDownloadTotal) * javaLavaLoadCount);
    // gameText = document.createTextNode("Loading "+percentage);
    updateJavaLavaText("Loading "+percentage,1);
}

function checkForJavaLavaGame(){
    var items = document.body.getElementsByTagName("*");
    for(let script = 0; script < scriptsLoaded.length; script++){
        for(let i = 0; i < items.length; i++){
            if(items[i].tagName == "SCRIPT" && items[i].src.indexOf(scriptsLoaded[script]) >= 0)
                return true;
        }
    }
    return false;
}

function scriptLoad(name){
    javaLavaLoadCount++;
    scriptsLoaded.push(name);
    console.log("Loading item # "+javaLavaLoadCount+"\tName = "+name);
    // Updating loading text
    removeGameText();
    if(javaLavaStarting)
        updateLoadingText();
}

async function createGameScriptElements(name){
    const parent = document.getElementById("gameContainer");
    var ele = document.createElement('script');
    await fetch(name)
    .then( res => res.blob() )
    .then((myBlob) => {
        const url = URL.createObjectURL(myBlob);
        ele.src =  url;//URL.createObjectURL(myBlob);//URL.createObjectURL(myBlob);//name;//filename;
        ele.onload = scriptLoad(url);
        parent.appendChild(ele);
    });
    return ele;
}

function downloadWaitingInterval(timer,downloadAmount){
    if(javaLavaLoadCount >= downloadAmount){
        // javaLavaLoadCount = 0;
        removeGameText();
        createGame();
        clearInterval(javaLavaGameDownloadInterval);
    }
    if(Date.now() > timer){
        // javaLavaLoadCount = 0;
        clearInterval(javaLavaGameDownloadInterval);
    }
}

function checkJavaLavaStarting(){
    if(javaLavaStarting){
        javaLavaStarting = false;
        clearInterval(javaLavaGameDownloadInterval);
        removeGameText();
        return true;
    }
    return false;
}

async function createJavaLavaGame(){
    // console.log("useragent = "+navigator.userAgent);
    //Browser check
    if(navigator.userAgent == undefined || 
        (!navigator.userAgent.includes("Chrome") &&
        !navigator.userAgent.includes("Safari") )){//navigator.userAgentData == undefined
        errorTextOpacity = 1;
        clearInterval(downloadErrorInterval);
        downloadErrorInterval = setInterval(function(){
            if(errorTextOpacity <= 0){
                errorTextOpacity = 0;
                removeGameText();
                clearInterval(downloadErrorInterval);
                return;
            }
            else if(errorTextOpacity > 0){
                errorTextOpacity -= 0.03;
                removeGameText();
                updateJavaLavaText("Unsupported browser",errorTextOpacity);
            }
        }, 100);
        return;
    }


    const address = document.location.href;
    if(javaLavaLoadCount < javaLavaDownloadTotal){//!checkForJavaLavaGame()
        if (checkJavaLavaStarting())
            return;
        javaLavaStarting = true;

        // javaLavaLoadCount = 0;
        // Creating loading text
        updateLoadingText();

        // Loading locally (for debug purposes, NOT CACHE)
        if(address.substring(0,4) == "file"){
            localJavaLavaGame(address);
        }
        // Loading from server
        else{
            let downloadCounter = 1;
            // Checking if download has been cancelled or if we've already downloaded specific files
            if(!javaLavaStarting ) return; else if((downloadCounter++) > javaLavaLoadCount )
                await createGameScriptElements(domainName+"js/javaLavaGameUtilities.js")
            if(!javaLavaStarting ) return; else if((downloadCounter++) > javaLavaLoadCount )
                await createGameScriptElements(domainName+"js/javaLavaGameGeometry.js")
            if(!javaLavaStarting ) return; else if((downloadCounter++) > javaLavaLoadCount )
                await createGameScriptElements(domainName+"js/javaLavaGameFX.js")
            if(!javaLavaStarting ) return; else if((downloadCounter++) > javaLavaLoadCount )
                await createGameScriptElements(domainName+"js/javaLavaGameHUD.js")
            if(!javaLavaStarting ) return; else if((downloadCounter++) > javaLavaLoadCount )
                await createGameScriptElements(domainName+"js/javaLavaGameMenu.js")
            if(!javaLavaStarting ) return; else if((downloadCounter++) > javaLavaLoadCount )
                await createGameScriptElements(domainName+"js/javaLavaGameBlackHole.js")
            if(!javaLavaStarting ) return; else if((downloadCounter++) > javaLavaLoadCount )
                await createGameScriptElements(domainName+"js/javaLavaGameWarningSign.js")
            if(!javaLavaStarting ) return; else if((downloadCounter++) > javaLavaLoadCount )
                await createGameScriptElements(domainName+"js/javaLavaGameLava.js")
            if(!javaLavaStarting ) return; else if((downloadCounter++) > javaLavaLoadCount )
                await createGameScriptElements(domainName+"js/javaLavaGamePlayer.js")
            if(!javaLavaStarting ) return; else if((downloadCounter++) > javaLavaLoadCount )
                await createGameScriptElements(domainName+"js/javaLavaGamePlatform.js")
            if(!javaLavaStarting ) return; else if((downloadCounter++) > javaLavaLoadCount )
                await createGameScriptElements(domainName+"js/javaLavaGamePhysics.js")
            if(!javaLavaStarting ) return; else if((downloadCounter++) > javaLavaLoadCount )
                await createGameScriptElements(domainName+"js/javaLavaGameCamera.js")
            if(!javaLavaStarting ) return; else if((downloadCounter++) > javaLavaLoadCount )
                await createGameScriptElements(domainName+"js/javaLavaGameKeyboard.js")
            if(!javaLavaStarting ) return; else if((downloadCounter++) > javaLavaLoadCount )
                await createGameScriptElements(domainName+"js/javaLavaGame.js")
            if(!javaLavaStarting ) return; else if((downloadCounter++) > javaLavaLoadCount )
                await createGameScriptElements(domainName+"js/javaLavaGameMouse.js")
        }
        const timer = Date.now()+loadTimeout;
        javaLavaGameDownloadInterval = setInterval(downloadWaitingInterval, 100, timer, javaLavaDownloadTotal);
    }
    else{
        clearInterval(javaLavaGameDownloadInterval);
        removeGameText();
        if(javaLavaLoadCount == 0 || javaLavaLoadCount == javaLavaDownloadTotal)
            createGame();
    }
}