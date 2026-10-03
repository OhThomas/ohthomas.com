if(document.referrer.includes("thomasdonn.com")){
    const header = document.getElementById("headerimg");
    header.setAttribute("usemap","#thomasdonnmap");
    header.src = "images/thomasdonnbanner.png";
    document.title = "Thomas Donn"
}