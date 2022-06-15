const http = require("http");
const url = require("url");
const topic = require("./lib/topic");
const author = require("./lib/author");
const path = require("path");
const PORT = 65535;

const app = http.createServer((req, res) => {
	const _url = req.url;
	const queryData = url.parse(_url, 1).query;
	queryData.id ? filterId = path.parse(queryData.id).base : filterId = "";
	const pathname = url.parse(_url, true).pathname;
	if (pathname === "/" || pathname === "/index.html")
		topic.home(req, res, queryData.id);
	else if (pathname === "/create")
		topic.create(req, res)
	else if (pathname === "/create_process")
		topic.create_process(req, res)
	else if (pathname === "/update")
		topic.update(req, res, queryData.id)
	else if (pathname === "/update_process")
		topic.update_process(req, res)
	else if (pathname === "/delete_process")
		topic.delete_process(req, res)
	else if (pathname === "/author")
		author.home(req, res);
	else if (pathname === "/author/create_process")
		author.create_process(req, res);
	else if (pathname === "/author/update")
		author.update(req, res, queryData.id);
	else if (pathname === "/author/update_process")
		author.update_process(req, res);
	else if (pathname === "/author/delete_process")
		author.delete_process(req, res);
	else
		topic.not_found(req, res);
});

app.listen(PORT, () => {
	console.log(`Server started on http://localhost:${PORT}`);
});