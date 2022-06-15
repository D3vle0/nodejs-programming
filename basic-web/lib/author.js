const qs = require("querystring");
const db = require("./db");
const htmlEscape = require("./escape");
const template = require("./template.js");

exports.home = (req, res) => {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        db.query(`SELECT * FROM author`, (err2, authors) => {
            const title = "작성자 관리";
            const list = template.list(topics);
            const html = template.html(title, list, `${template.authorTable(authors)}
                <style>
                    table {
                        border-collapse: collapse;
                    }
                    td, th {
                        border : 1px solid black;
                    }
                </style>
                <form action="/author/create_process" method="post">
                    <p><input type="text" name="name" placeholder="name"></p>
                    <p><textarea name="profile" placeholder="description"></textarea></p>
                    <p><input type="submit" value="작성자 추가"></p>
                </form>
            `);
            res.writeHead(200);
            res.end(html);
        });
    });
};

exports.create_process = (req, res) => {
    var body = "";
    req.on("data", data => {
        body += data;
    });
    req.on("end", () => {
        const post = qs.parse(body);
        db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`, [htmlEscape.escape(post.name), htmlEscape.escape(post.profile)], (err, result) => {
            if (err) throw err;
            res.writeHead(302, { Location: `/author` });
            res.end();
        });
    });
};

exports.update = (req, res, id) => {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        db.query(`SELECT * FROM author`, (err2, authors) => {
            const title = "작성자 수정";
            const list = template.list(topics);
            const html = template.html(title, list, `${template.authorTable(authors)}
                <style>
                    table {
                        border-collapse: collapse;
                    }
                    td, th {
                        border : 1px solid black;
                    }
                </style>
                <form action="/author/update_process" method="post">
                    <input type="hidden" name="id" value="${id}">
                    <p><input type="text" name="name" placeholder="name"></p>
                    <p><textarea name="profile" placeholder="description"></textarea></p>
                    <p><input type="submit" value="작성자 수정"></p>
                </form>
            `);
            res.writeHead(200);
            res.end(html);
        });
    });
};

exports.update_process = (req, res) => {
    var body = "";
    req.on("data", data => {
        body += data;
    });
    req.on("end", () => {
        const post = qs.parse(body);
        db.query(`UPDATE author SET name=?, profile=? WHERE id=?`, [htmlEscape.escape(post.name), htmlEscape.escape(post.profile), htmlEscape.escape(post.id)], (err, result) => {
            if (err) throw err;
            res.writeHead(302, { Location: `/author` });
            res.end();
        });
    });
};

exports.delete_process = (req, res) => {
    var body = "";
    req.on("data", data => {
        body += data;
    });
    req.on("end", () => {
        const post = qs.parse(body);
        db.query(`DELETE FROM author WHERE id=?`, [post.id], (err, result) => {
            if (err) throw error;
            res.writeHead(302, { Location: `/author` });
            res.end();
        });
    });
}