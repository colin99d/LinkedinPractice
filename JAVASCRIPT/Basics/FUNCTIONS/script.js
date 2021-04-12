//Normal function
function findBiggestFraction(a,b){
    var result;
    a>b ? result = ['first fraction', a] : result = ['second fraction', b];
    return result;
}

var a =2/4;
var b = 5/7;

var results = findBiggestFraction(a,b);

//Anyonymous function
var theBiggest = function(a,b) {
    var result;
    a>b ? result = ['a', a] : result = ['b', b];
    return result;
}(1/2,2/3) //remove to declare variables in function call

console.log(theBiggest);