// if(document.location.href.indexOf("www.thomasdonn.com") >= 0){
if(document.URL.includes("www.thomasdonn.com")){
    const header = document.getElementById("headerimg");
    header.setAttribute("usemap","#thomasdonnmap");
    header.src = "images/thomasdonnbanner.png";
}