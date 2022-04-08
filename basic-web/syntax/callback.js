const a = function (){
    console.log("AAA");
}

function slowfunc(callback) {
    callback(callback);
}

slowfunc(a)