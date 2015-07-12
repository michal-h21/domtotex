var system = require("system");
var page   = require("webpage").create(), address, base;
if(system.args.length === 1) {
				console.log("Usage html2latex url");
				phantom.exit();
} else {
address = system.args[1];
base = "body"; 
if (system.args[2]){
  base = system.args[2];
}
page.onConsoleMessage = function(msg){
  phantom.outputEncoding = "utf-8";
	console.log(msg);
};
console.log("% saved page: "+address);
var traverse = "domtotex.js";//"traverser.js";
var mustache = "mustache.js";
page.open(address, function(st){
  if(st == "success"){
    page.injectJs(mustache);
    page.injectJs(traverse);//, function(){
    page.injectJs("textemplates.js");
    var result = page.evaluate(function(){
      console.log()
      var ti = document.querySelector("title");
      var getText = Domtotex.getText;
      var title = getText(ti);
      //var title=getText;
      var body = getText(document.querySelector("body"));
      //console.log(body);
      return {title: title, body: body};
    });
    var body = result.body;
    var title = result.title;
    if(body.length > 0) {
      console.log("\\documentclass{scrartcl}");
      console.log("\\usepackage{fontspec,hyperref}");
      //latexCommand("title",title);
      console.log("\\title{"+title+"}");
      console.log("\\begin{document}");
      console.log(body);
      console.log("\\end{document}");
    } else {
      console.log("Can't process the document body")
    }
    phantom.exit();
    //});
    //phantom.exit();
  }else{
    console.log("Cannot load page "+address);
    phantom.exit();
  }
});
}

