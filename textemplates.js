
var tplStart		= Textpl.tplStart;
var brackets    = Textpl.brackets;
var tplEnd			= Textpl.tplEnd;
var variables   = Textpl.variables;

var templates = {
  "h1": [
  {
    "selector": "*",
    "template": '\\section{<<content>>}'
  }],
  "i" : [
  {
   "selector": "*",
   "template": "\\textit{<<content>>}"
  }
  ],
  "b": [{
   "selector": "*",
   "template": "\\textbf{<<content>>}"
  }],
  "math": [{
    "selector": "[mode='display']",
    "template": "\\[<<content>>\\]"
  },{
    "selector": "*",
    "template": "$<<content>>$" 
  }],
  "mfrac": [{
   "selector" :"*",
	 "template": "\\frac{<<>first>>}{<<>second>>}"
	}],
	"msqrt": [{
		"selector": "*",
		"template": "\\sqrt{<<content>>}"
	}],
	"msup": [{
		"selector": "*",
		"template": "<<>first>>^<<>second>>"
	}],
	"a": [{
		"template": "<<#link>><<#attr>>href<</attr>><</link>>{<<content>>}",
		"selector": "*",
		"packages": ["hyperref"]
	}],
  "*default": [{
    "selector": "*",
    "template": "<<content>>"
  }
  ]
}	


Textpl.loadTemplates(templates);

Textpl.addTemplate("img").tpl("\\includegraphics{<<#attr>>src<</attr>>}");
Textpl.addFunction("nth", //function(){
    //return 
		function(t, render) {
			//var curr = el;
		 var n = parseInt(t);
		 var el =  variables["element"];
     var curr =el.children;
		 var ret = getText(curr[n]);
		 variables["element"] = el;
		 return ret;
   }
  //}
);

Textpl.addFunction("attr", function(t, render){
		 var el =  variables["element"];
		 return el.getAttribute(t);
//
		});

Textpl.addFunction("link", function(t, render){
		var t = brackets + t
		var href = render(t);
		var isLocal =  !/^(http)/.test(href) ;
		var tpl = isLocal && "loc-link" || "syst-link";
		return  render(brackets+tplStart + "#" + tpl + tplEnd + href + tplStart +"/" + tpl + tplEnd);

		})
Textpl.addFunction("loc-link", function(t, render){
		return "\\hyperlink{"+render(t)+"}";
});

Textpl.addFunction("syst-link", function(t, render){
				return "\\href{"+render(t)+"}";
});

Textpl.addPartial("first", "<<#nth>>0<</nth>>")
Textpl.addPartial("second", "<<#nth>>1<</nth>>")
