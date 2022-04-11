const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const url = require("url");
const PORT = 65535;

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
        const list = templatelist(filelist);
        const template = templateHTML(title, list, `<h2>${title || "환영합니다."}</h2> <p>${description || "홈페이지 입니다.<br><br><a href='/create'><button>create</button></a>"}</p>`);
        res.writeHead(200);
        res.end(template);
      })
    });
  }
  else if (pathname === "/create") {
    fs.readdir("./data", (err, filelist) => {
      const title = "create";
      const list = templatelist(filelist);
      const template = templateHTML(title, list, `
      <form action="http://localhost:${PORT}/create_process" method="post">
        <p><input type="text" name="title"></p>
        <p><textarea name="description"></textarea></p>
        <input type="submit" value="submit">
      </form>`);
      res.writeHead(200);
      res.end(template);
    })
  }
  else if (pathname === "/create_process") {
    var body = "";
    req.on("data", (data) => {
      body += data;
    })
    req.on("end", () => {
      const post = qs.parse(body);
      const title = post.title;
      const description = post.description;
      fs.writeFile(`./data/${title}`, description, "utf-8", (err) => {
        res.writeHead(302, { Location: `/?id=${title}` });
        res.end("create_process");
      });
      console.log(post);
    });
  }
  else {
    res.writeHead(404);
    res.end("Not Found");
  }
});
app.listen(PORT, () => {
  console.log("start");
});
