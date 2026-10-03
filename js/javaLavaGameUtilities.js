function myDomain(){
    if(document.URL.includes("ohthomas.com") || document.URL.includes("thomasdonn.com"))
        return true;
    else
        return false;
}

function clamp(number,min,max){
    if(number >= max)
        return number = max;
    else if(number <= min)
        return number = min;
    else
        return number;
}

// Random int between two numbers
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

// Pads hex number with 0's
function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function hexToDec(s) {
    var i, j, digits = [0], carry;
    for (i = 0; i < s.length; i += 1) {
        carry = parseInt(s.charAt(i), 16);
        for (j = 0; j < digits.length; j += 1) {
            digits[j] = digits[j] * 16 + carry;
            carry = digits[j] / 10 | 0;
            digits[j] %= 10;
        }
        while (carry > 0) {
            digits.push(carry % 10);
            carry = carry / 10 | 0;
        }
    }
    return digits.reverse().join('');
}

function decToHex(number,size){
    if (number < 0){
        number = 0xFFFFFFFF + number + 1;
    }
    return pad(number.toString(16).toUpperCase(),size);
}

function createLocalStorageItem(item){
    const itemCheck = localStorage.getItem(item);
    if(itemCheck == null)
        localStorage.setItem(item,0);
}

function createLocalStorage(){
    createLocalStorageItem("highScoreNormal");
    createLocalStorageItem("highScoreEasy");
}