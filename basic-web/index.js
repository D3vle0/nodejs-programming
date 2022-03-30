const http = require("http");
const fs = require("fs")
const qs = require("querystring");
const url = require("url");

const app = http.createServer((req, res) => {
    var _url = req.url;
    const queryData = url.parse(_url, 1).query;
    console.log(queryData.name);
    if (req.url == "/") {
        _url = "/index.html";
    }
    if (req.url == "/favicon.ico") {
        return res.writeHead(404);
    }
    res.writeHead(200);
    res.end(fs.readFileSync(__dirname + _url));
    // res.end(queryData.name);
    console.log(queryData.name);
});

app.listen(65535);