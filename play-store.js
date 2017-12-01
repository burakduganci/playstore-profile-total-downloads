var Nightmare = require('nightmare'),
  vo = require('vo');
var nightmare = Nightmare({ show: false });


nightmare.goto("https://play.google.com/store/apps/developer?id="+process.argv[2])
  .inject('js', 'jquery.js')
  .wait("body")
  .evaluate(function(){
    var apps = [];
    $(".card > .card-content > .card-click-target").each(function(){
      apps.push("https://play.google.com"+ $(this).attr("href"));
    });
    return apps;
  })
  .then(function(apps){
    console.log("Uygulamalar alındı. \n --------------");

    var run = function * () {
    var urls = apps;
    var links = [];
    for (var i = 0; i < urls.length; i++) {
        var title = yield nightmare.goto(urls[i])
          .inject('js', 'jquery.js')
          .wait('body')
          .evaluate(function() {
            var s = $('body .id-app-title').html() + " - " + $("body div[itemprop='numDownloads']").html();
            return s;
          })
          .then(function(e){

            console.log(e);
          })
          .catch((error) => {
            console.error('Search failed:', error);
          });
      }
      return links;
    }

    vo(run)(function(err) {
      console.log("Uygulamalar bitti.");
    });
  })
