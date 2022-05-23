const http = require("http");
const fs = require("fs")
const qs = require("querystring");
const url = require("url");

const app = http.createServer((req, res) => {
    var _url = req.url;
    const queryData = url.parse(_url, 1).query;
    var title = queryData.id;
    if (req.url == "/") {
        _url = "/index.html";
    }
    if (req.url == "/favicon.ico") {
        return res.writeHead(404);
    }
    res.writeHead(200);
    fs.readFile(`data/${queryData.id}`, "utf-8", function (err, description) {
        var template = `<!doctype html>
        <html>
        <head>
          <title>WEB1 - HTML</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="index.html">WEB</a></h1>
          <ol>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=Javascript">JavaScript</a></li>
          </ol>
          <h2>${title}</h2>
          <p>${description}</p>
        </body>
        </html>
        `;

        res.end(template);
    })
    // res.end(fs.readFileSync(__dirname + _url));
    // res.end(queryData.name);
    // console.log(queryData.name);
});

app.listen(65535);