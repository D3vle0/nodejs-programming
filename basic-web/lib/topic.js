const qs = require("querystring");
const template = require("./template");
const db = require("./db");
const htmlEscape = require("./escape");
const time = require("./time");

exports.home = (req, res, id) => {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        if (id) {
            db.query(`SELECT * FROM topic WHERE id=?`, [id], (err2, topic_row) => {
                try {
                    db.query(`SELECT * FROM author WHERE id=?`, [topic_row[0].author_id], (err3, authors) => {
                        const title = topic_row[0].title;
                        const description = topic_row[0].description;
                        var html = template.html(title, template.list(topics),
                            `<h2>${htmlEscape.escape(title) || "환영합니다."}</h2>
                    <p>${htmlEscape.escape(description) || "홈페이지 입니다."}</p> 
                    <p>${authors[0].name}</p>
                    <a href="/update?id=${id}"><input type="button" value="글 수정"></a> 
                    <form action="/delete_process" method="POST"> 
                        <input type="hidden" name="id" value="${id}"> 
                        <input type="submit" value="글 삭제" onclick="return(confirm('정말로 삭제하시겠습니까?'))"> 
                    </form>`);
                        res.writeHead(200);
                        res.end(html);
                    });
                }
                catch (e) {
                    this.not_found(req, res);
                }
            });
        }
        else {
            const html = template.html("Home", template.list(topics),
                `<h2>환영합니다.</h2>
            <p>홈페이지 입니다.</p>
            <a href="/create"><input type="button" value="글 작성"></a>`);
            res.writeHead(200);
            res.end(html);
        }
    });
}

exports.create = (req, res) => {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        db.query(`SELECT * FROM author`, (err2, authors) => {
            const title = "create";
            const list = template.list(topics);
            const tag = template.authorSelect(authors, 1)
            const html = template.html(title, list, `
            <form action="http://localhost:65535/create_process" method="post">
                <p><input type="text" name="title" required></p>
                <p><textarea name="description" required></textarea></p>
                <p>${tag}</p>
                <input type="submit" value="작성">
            </form>`);
            res.writeHead(200);
            res.end(html);
        });
    });
}

exports.create_process = (req, res) => {
    var body = "";
    req.on("data", data => {
        body += data;
    });
    req.on("end", () => {
        const post = qs.parse(body);
        const title = htmlEscape.escape(post.title);
        const description = htmlEscape.escape(post.description);
        const author = post.author;
        const current_time = time.current_time();
        db.query(`INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, ?, ?)`, [title, description, current_time, author], (err, result) => {
            res.writeHead(302, { Location: `/` });
            res.end("create_process");
        });
    });
}

exports.update = (req, res, id) => {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        db.query(`SELECT * FROM topic WHERE id=?`, [id], (err, topic_row) => {
            db.query(`SELECT * FROM author`, (err2, authors) => {
                try {
                    const title = topic_row[0].title;
                    const description = topic_row[0].description;
                    const list = template.list(topics);
                    const tag = template.authorSelect(authors, topic_row[0].author_id);
                    const html = template.html(title, list, `
                    <form action="http://localhost:65535/update_process" method="post">
                    <input type="hidden" name="id" value="${id}">
                        <p><input type="text" name="title" value=${title} required></p>
                        <p><textarea name="description" required>${description}</textarea></p>
                        <p>${tag}</p>
                        <input type="submit" value="수정">
                    </form>`);
                    res.writeHead(200);
                    res.end(html);
                }
                catch (e) {
                    this.not_found(req, res);
                }
            });
        });
    });
}

exports.update_process = (req, res) => {
    var body = "";
    req.on("data", data => {
        body += data;
    });
    req.on("end", () => {
        const post = qs.parse(body);
        const id = htmlEscape.escape(post.id);
        const title = htmlEscape.escape(post.title);
        const description = htmlEscape.escape(post.description);
        const author = htmlEscape.escape(post.author);
        db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, [title, description, author, id], (err, result) => {
            res.writeHead(302, { Location: `/?id=${id}` });
            res.end("update_process");
        });
    });
}

exports.delete_process = (req, res) => {
    var body = "";
    req.on("data", data => {
        body += data;
    });
    req.on("end", () => {
        const post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE id=?`, [post.id], (err, result) => {
            res.writeHead(302, { Location: `/` });
            res.end("delete_process");
        });
    });
}

exports.not_found = (req, res) => {
    res.writeHead(404);
    res.end("<h1>404 Not Found</h1>");
}