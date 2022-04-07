const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const url = require("url");

const app = http.createServer((req, res) => {
  const _url = req.url;
  const queryData = url.parse(_url, 1).query;
  const title = queryData.id;
  const pathname = url.parse(_url, true).pathname;
  if (pathname === "/" || pathname === "/index.html") {
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
          <h2>${title || "환영합니다."}</h2>
          <p>${description || "홈페이지 입니다."}</p>
        </body>
        </html>
        `;
      res.writeHead(200);
      res.end(template);
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});
app.listen(65535);
