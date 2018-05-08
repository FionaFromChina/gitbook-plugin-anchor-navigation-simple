// based on https://github.com/yaneryou/gitbook-plugin-anchor-navigation

var cheerio = require('cheerio');

function get_id(text) {
  return text.replace(/[,;. &%+*\/]/g, "_");
}

module.exports = {
  book: {
    assets: "."
  },
  hooks: {
    "page": function(page) {

      var $ = cheerio.load(page.content);

      var toc = [];
      var title_id = "";
      var title = "";
      var h2 = 0;
      $(':header').each(function(i, elem) {
        var header = $(elem);
        header.attr("id", get_id(header.text()));

        switch (header[0].name) {
          case "h1":
            title_id = header.attr("id");
            title = header.text();
            break;
          case "h2":
            h2 += 1;
            h3 = h4 = 0;
            // text = h2 + ". " + header.text();
            text =  header.text();
            header.text(text);
            toc.push({
              name: header.text(),
              url: header.attr("id"),
              children: []
            });
            break;
          default:
            break;
        }
      });

      if (toc.length == 0) {
        page.content = $.html();
        return page;
      }

      var html = "<div id='anchors-navbar'><ul><p><a href='#" + title_id +"'>" + title + "</a></p>";
      for(var i=0;i<toc.length;i++) {
        html += "<li><a href='#"+toc[i].url+"'>"+toc[i].name+"</a></li>";
        if(toc[i].children.length>0) {
          html += "<ul>"
          for(var j=0;j<toc[i].children.length;j++){
            html += "<li><a href='#"+toc[i].children[j].url+"'>"+toc[i].children[j].name+"</a></li>";
            if(toc[i].children[j].children.length>0){
              html += "<ul>";
              for(var k=0;k<toc[i].children[j].children.length;k++){
                html += "<li><a href='#"+toc[i].children[j].children[k].url+"'>"+toc[i].children[j].children[k].name+"</a></li>";
              }
              html += "</ul>";
            }
          }
          html += "</ul>"
        }
      }
      html += "</ul></div>";

      page.content = $.html() + html;
      return page;
    }
  }
};