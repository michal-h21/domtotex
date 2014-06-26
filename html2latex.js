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
	page.injectJs(mustache);
  page.injectJs(traverse);//, function(){
	page.injectJs("textemplates.js");
    page.evaluate(function(){
      var ti = document.querySelector("title");
			var getText = Domtotex.getText;
      var title = getText(ti);
			//var title=getText;
			console.log("\\documentlass{scrartcl}");
			console.log("\\usepackage{fontspec}");
			//latexCommand("title",title);
			console.log("\\title{"+title+"}");
			console.log("\\begin{document}");
			var body = getText(document.querySelector("body"));
			if(body.length > 0) {
			   console.log(body);
			}
		});
    phantom.exit();
	//});
  //phantom.exit();
});
}
