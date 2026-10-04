const headerContainer = document.getElementById("head");
if(document.URL.includes("thomasdonn.com")){
    const header = document.getElementById("headerimg");
    header.src = "images/thomasdonnbanner.png";
    const map1 = document.createElement("a");
    const map2 = document.createElement("a");
    map1.id = 'anchor-thomasdonn1';
    map1.href = 'index.html';
    map1.alt = 'Thomas';
    map1.title = 'Thomas';
    map2.id = 'anchor-thomasdonn2';
    map2.href = 'index.html';
    map2.alt = 'Donn';
    map2.title = 'Donn';
    headerContainer.appendChild(map1);
    headerContainer.appendChild(map2);
}
else{
    const map1 = document.createElement("a");
    const map2 = document.createElement("a");
    const map3 = document.createElement("a");
    map1.id = 'anchor-ohthomas1';
    map1.href = 'index.html';
    map1.alt = 'Mario';
    map1.title = 'Mario';
    map2.id = 'anchor-ohthomas2';
    map2.href = 'index.html';
    map2.alt = 'Oh';
    map2.title = 'Oh';
    map3.id = 'anchor-ohthomas3';
    map3.href = 'index.html';
    map3.alt = 'Thomas';
    map3.title = 'Thomas';
    headerContainer.appendChild(map1);
    headerContainer.appendChild(map2);
    headerContainer.appendChild(map3);
}