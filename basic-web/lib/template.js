const template = {
    html: function(title, list, body) {
        title = title ? `WEB1 - ${title}` : "WEB1";
        return `<!doctype html>
    <html>
    <head>
      <title>${title}</title>
      <meta charset="utf-8">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    </head>
    <body>
      <h1><a href="index.html">WEB</a></h1>
      ${list}
      <p>${body}</p>
    </body>
    </html>
    `
    },
    list: function (topics) {
        let list = "<ul>";
        for (let i = 0; i < topics.length; i++)
            list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
        list += "</ul>";
        return list;
    }
}

module.exports = template;