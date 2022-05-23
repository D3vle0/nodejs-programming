const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const url = require("url");
const template = require("./lib/template");
const path = require("path");
const PORT = 65535;

const htmlEscape = text => {
  return text.replace(/&/g, '&amp;').
    replace(/</g, '&lt;').
    replace(/"/g, '&quot;').
    replace(/'/g, '&#039;');
}

const app = http.createServer((req, res) => {
  const _url = req.url;
  const queryData = url.parse(_url, 1).query;
  queryData.id ? filterId = path.parse(queryData.id).base : filterId = "";
  const title = queryData.id;
  const pathname = url.parse(_url, true).pathname;
  if (pathname === "/" || pathname === "/index.html") {
    fs.readFile(`./data/${filterId}`, "utf-8", (err, description) => {
      fs.readdir("./data", (err, filelist) => {
        const list = template.list(filelist);
        if (title)
          var html = template.html(title, list,
            `<h2>${htmlEscape(title) || "환영합니다."}</h2>
            <p>${description || "홈페이지 입니다."}</p> 
            <a href="/update?id=${title}"><input type="button" value="글 수정"></a> 
            <form action="/delete_process" method="POST"> 
              <input type="hidden" name="id" value="${title}"> 
              <input type="submit" value="글 삭제" onclick="return(confirm('정말로 삭제하시겠습니까?'))"> 
            </form>`);
        else
          var html = template.html(title, list,
            `<h2>${title || "환영합니다."}</h2>
            <p>${description || "홈페이지 입니다."}</p> 
            <a href="/create"><input type="button" value="글 작성"></a>`);
        res.writeHead(200);
        res.end(html);
      })
    });
  }
  else if (pathname === "/create") {
    fs.readdir("./data", (err, filelist) => {
      const title = "create";
      const list = template.list(filelist);
      const html = template.html(title, list, `
      <form action="http://localhost:${PORT}/create_process" method="post">
        <p><input type="text" name="title"></p>
        <p><textarea name="description"></textarea></p>
        <input type="submit" value="작성">
      </form>`);
      res.writeHead(200);
      res.end(html);
    })
  }
  else if (pathname === "/create_process") {
    var body = "";
    req.on("data", (data) => {
      body += data;
    });
    req.on("end", () => {
      const post = qs.parse(body);
      // const title = post.title;
      const title = htmlEscape(post.title);
      // const description = post.description;
      const description = htmlEscape(post.description);
      fs.writeFile(`./data/${title}`, description, "utf-8", (err) => {
        res.writeHead(302, { Location: `/?id=${title}` });
        res.end("create_process");
      });
    });
  }
  else if (pathname === "/update") {
    const filterId = path.parse(queryData.id).base;
    fs.readdir("./data", (err, filelist) => {
      fs.readFile(`./data/${filterId}`, "utf-8", (err, description) => {
        const title = queryData.id;
        const list = template.list(filelist);
        const html = template.html(title, list, `
        <form action="http://localhost:${PORT}/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" value=${title}></p>
          <p><textarea name="description">${description}</textarea></p>
          <input type="submit" value="수정">
        </form>`);
        res.writeHead(200);
        res.end(html);
      });
    })
  }
  else if (pathname === "/update_process") {
    var body = "";
    req.on("data", (data) => {
      body += data;
    });
    req.on("end", () => {
      const post = qs.parse(body);
      // const title = post.title;
      const title = htmlEscape(post.title);
      // const description = post.description;
      const description = htmlEscape(post.description);
      const id = post.id;
      fs.rename(`./data/${id}`, `./data/${title}`, (err) => {
        fs.writeFile(`./data/${title}`, description, "utf-8", (err) => {
          res.writeHead(302, { Location: `/?id=${title}` });
          res.end("update_process");
        });
      });
    });
  }
  else if (pathname === "/delete_process") {
    var body = "";
    req.on("data", (data) => {
      body += data;
    });
    req.on("end", () => {
      const post = qs.parse(body);
      const id = path.parse(post.id).base;;
      fs.unlink(`./data/${id}`, (err) => {
        res.writeHead(302, { Location: `/` });
        res.end("delete_process");
      });
    });
  }
  else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});