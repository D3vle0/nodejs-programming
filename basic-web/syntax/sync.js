const fs = require("fs");
console.log("A");
const result = fs.readFileSync("../nodefiles/sample.txt", "utf-8");
console.log(result);
console.log("c");