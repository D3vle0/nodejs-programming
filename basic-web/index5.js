const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const url = require("url");
const template = require("./lib/template");
const path = require("path");
const PORT = 65535;

require("dotenv").config();

const mysql = require("mysql");
const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: process.env.DB_PASSWORD,
	database: "dimigo",
});
db.connect();

const htmlEscape = text => {
	return text.replace(/&/g, '&amp;').
		replace(/</g, '&lt;').
		replace(/"/g, '&quot;').
		replace(/'/g, '&#039;');
}

const current_time = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = ('0' + (today.getMonth() + 1)).slice(-2);
	const day = ('0' + today.getDate()).slice(-2);
	const dateString = year + '-' + month + '-' + day;
	const hours = ('0' + today.getHours()).slice(-2);
	const minutes = ('0' + today.getMinutes()).slice(-2);
	const seconds = ('0' + today.getSeconds()).slice(-2);
	const timeString = hours + ':' + minutes + ':' + seconds;
	const time = dateString + ' ' + timeString;

	return time;
}

const app = http.createServer((req, res) => {
	const _url = req.url;
	const queryData = url.parse(_url, 1).query;
	queryData.id ? filterId = path.parse(queryData.id).base : filterId = "";
	const pathname = url.parse(_url, true).pathname;
	if (pathname === "/" || pathname === "/index.html") {
		db.query(`SELECT * FROM topic`, (err, topics) => {
			if (err) throw err;
			if (queryData.id) {
				db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (err2, topic_row) => {
					if (err2) throw err2;
					try {
						const title = topic_row[0].title;
						const description = topic_row[0].description;
						var html = template.html(title, template.list(topics),
							`<h2>${htmlEscape(title) || "환영합니다."}</h2>
							<p>${description || "홈페이지 입니다."}</p> 
							<a href="/update?id=${queryData.id}"><input type="button" value="글 수정"></a> 
							<form action="/delete_process" method="POST"> 
								<input type="hidden" name="id" value="${queryData.id}"> 
								<input type="submit" value="글 삭제" onclick="return(confirm('정말로 삭제하시겠습니까?'))"> 
							</form>`);
						res.writeHead(200);
						res.end(html);
					}
					catch (e) {
						res.writeHead(404);
						res.end("<h1>Not Found</h1>");
					}
				});
			}
			else {
				var html = template.html("Home", template.list(topics),
					`<h2>환영합니다.</h2>
						<p>홈페이지 입니다.</p>
						<a href="/create"><input type="button" value="글 작성"></a>`);
				res.writeHead(200);
				res.end(html);
			}
		});
	}
	else if (pathname === "/create") {
		db.query(`SELECT * FROM topic`, (err, topics) => {
			db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (err2, topic_row) => {
				const title = "create";
				const list = template.list(topics);
				const html = template.html(title, list, `
				<form action="http://localhost:${PORT}/create_process" method="post">
					<p><input type="text" name="title"></p>
					<p><textarea name="description"></textarea></p>
					<input type="submit" value="작성">
				</form>`);
				res.writeHead(200);
				res.end(html);
			});
		});
	}
	else if (pathname === "/create_process") {
		var body = "";
		req.on("data", (data) => {
			body += data;
		});
		req.on("end", () => {
			const post = qs.parse(body);
			const title = htmlEscape(post.title);
			const description = htmlEscape(post.description);
			const time = current_time();
			console.log(title, description, time);
			db.query(`INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, ?, ?)`, [title, description, time, 1], (err, result) => {
				res.writeHead(302, { Location: `/` });
				res.end("create_process");
			});
		});
	}
	else if (pathname === "/update") {
		db.query(`SELECT * FROM topic`, (err, topics) => {
			db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (err, topic_row) => {
				try {
					const title = topic_row[0].title;
					const description = topic_row[0].description;
					const list = template.list(topics);
					const html = template.html(title, list, `
					<form action="http://localhost:${PORT}/update_process" method="post">
					<input type="hidden" name="id" value="${queryData.id}">
						<p><input type="text" name="title" value=${title}></p>
						<p><textarea name="description">${description}</textarea></p>
						<input type="submit" value="수정">
					</form>`);
					res.writeHead(200);
					res.end(html);
				}
				catch (e) {
					res.writeHead(404);
					res.end("<h1>Not Found</h1>");
				}
			});
		});
	}
	else if (pathname === "/update_process") {
		var body = "";
		req.on("data", (data) => {
			body += data;
		});
		req.on("end", () => {
			const post = qs.parse(body);
			const id = htmlEscape(post.id);
			const title = htmlEscape(post.title);
			const description = htmlEscape(post.description);
			db.query(`UPDATE topic SET title=?, description=? WHERE id=?`, [title, description, id], (err, result) => {
				res.writeHead(302, { Location: `/?id=${id}` });
				res.end("update_process");
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
			db.query(`DELETE FROM topic WHERE id=?`, [post.id], (err, result) => {
				res.writeHead(302, { Location: `/` });
				res.end("delete_process");
			});
		});
	}
	else {
		res.writeHead(404);
		res.end("<h1>Not Found</h1>");
	}
});

app.listen(PORT, () => {
	console.log(`Server started on http://localhost:${PORT}`);
});