const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const url = require("url");

function templateHTML(title, list, body) {
  return `<!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title || ""}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="index.html">WEB</a></h1>
    ${list}
    <p>${body}</p>
  </body>
  </html>
`
}

function templatelist(filelist) {
  let list = "<ol>";
  for (let i = 0; i < filelist.length; i++)
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
  list += "</ol>";
  return list;
}

const app = http.createServer((req, res) => {
  const _url = req.url;
  const queryData = url.parse(_url, 1).query;
  const title = queryData.id;
  const pathname = url.parse(_url, true).pathname;
  if (pathname === "/" || pathname === "/index.html") {
    fs.readFile(`./data/${queryData.id}`, "utf-8", (err, description) => {
      fs.readdir("./data", (err, filelist) => {
        var list = templatelist(filelist);
        var template = templateHTML(title, list, `<h2>${title || "환영합니다."}</h2> <p>${description || "홈페이지 입니다."}</p>`);
        res.writeHead(200);
        res.end(template);
      })
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});
app.listen(65535, () => {
  console.log("start");
});
