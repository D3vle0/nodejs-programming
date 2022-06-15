const template = {
	html: (title, list, body) => {
		title = title ? `WEB1 - ${title}` : "WEB1";
		return `<!doctype html>
    <html>
    <head>
    	<title>${title}</title>
    	<meta charset="utf-8">
    	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css" integrity="sha384-zCbKRCUGaJDkqS1kPbPd7TveP5iyJE0EjAuZQTgFLD2ylzuqKfdKlfG/eSrtxUkn" crossorigin="anonymous">
    </head>
    <body>
    	<div class="jumbotron jumbotron-fluid">
    		<div class="container">
        		<h1><a href="/index.html" class="display-4">WEB</a></h1>
        		<p class="lead">이것은 응용프로그래밍 개발 시간의 nodejs + mysql 실습 사이트입니다.</p>
				<a href="/author"><button type="button" class="btn btn-primary" data-toggle="modal">작성자 관리</button></a>
    		</div>
      	</div>
      <h1>Posts</h1>
      ${list}
      <p>${body}</p>
    </body>
    </html>`
	},
	list: topics => {
		var list = "<ul>";
		for (let i = 0; i < topics.length; i++)
			list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
		list += "</ul>";
		return list;
	},
	authorSelect: (authors, author_id) => {
		var tag = "";
		var i = 0;
		while (i < authors.length) {
			var selected = "";
			if (authors[i].id == author_id) selected = "selected";
			tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
			i++;
		}
		return `<select name="author">${tag}</select>`;
	},
	authorTable: authors => {
		var tag = "<table>";
		tag += `
			<tr style="border:1px solid black">
				<th>이름</th>
				<th>프로필</th>
				<th>수정</th>
				<th>삭제</th>
			</tr>`;
		var i = 0;
		while (i < authors.length) {
			tag += `
				<tr>
					<td>${authors[i].name}</td>
					<td>${authors[i].profile}</td>
					<td><a href="/author/update?id=${authors[i].id}">update</a></td>
					<td>
						<form action="/author/delete_process" method="post">
							<input type="hidden" name="id" value="${authors[i].id}">
							<input type="submit" value="delete" onclick="return(confirm('정말로 삭제하시겠습니까?'))">
						</form>
					</td>
				</tr>`;
			i++;
		}
		tag += "</table>";
		return tag;
	}
}

module.exports = template;