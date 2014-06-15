var Textpl = (function(Mustache){
var M = {};		

var tplStart = "<<";
var tplEnd   = ">>";
var brackets = "{{="+tplStart+" "+tplEnd+"=}}";
var partials = {};
var templates = {}

var loadTemplates = function(t){
  for(k in t){
    var v = templates[k] || [];
		templates[k] = v.concat(t[k]);
	}
}

var addPartial = function(name, tpl){
  partials[name] = brackets+tpl;
}

// Move this to better place?
addPartial(	"first", "<<#nth>>0<</nth>>")
addPartial("second", "<<#nth>>1<</nth>>")

/*
for(x in partials){
	var p = partials[x];
	p =brackets+p;
	partials[x] = p;
}
*/

var getVar = function(el){
	 log(el)
   return  el.replace(tplStart,"").replace(tplEnd,""); 
}

var variables = {}

var addFunction = function(name, fn){
	variables[name]=function(){ return fn};
}

addFunction("nth", //function(){
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

addFunction("attr", function(t, render){
		 var el =  variables["element"];
		 return el.getAttribute(t);
//
		});

addFunction("link", function(t, render){
		var t = brackets + t
		var href = render(t);
		var isLocal =  !/^(http)/.test(href) ;
		var tpl = isLocal && "loc-link" || "syst-link";
		log(isLocal);
		return  render(brackets+tplStart + "#" + tpl + tplEnd + href + tplStart +"/" + tpl + tplEnd);

		})
addFunction("loc-link", function(t, render){
		return "\\hyperlink{"+render(t)+"}";
});

addFunction("syst-link", function(t, render){
				return "\\href{"+render(t)+"}";
});


	var matches = function(el,selector){
		if(el.matches)
			return el.matches(selector);
		else if(el.mozMatchesSelector)
			return el.mozMatchesSelector(selector);
		else if(el.webkitMatchesSelector)
			return el.webkitMatchesSelector(selector);
	}

function getTemplate(element){
    var tplmatch, template;
    var name = element.nodeName.toLowerCase() || element;
		Mustache.escape = function(s){return s;}//latexEscape;
    if(templates[name]){
       tplmatch = templates[name];
    }else{
       tplmatch = templates['*default'];
    }
    for(i = 0;i<tplmatch.length;i++){
      // log(name+"; "+tplmatch[i].template+", "+tplmatch[i].selector);
      if(matches(element, tplmatch[i].selector)){
         template = tplmatch[i].template;
         break;
      }  
    }
    template = brackets+template;
		return template;
}

var render = function(element, vars){
	var template = getTemplate(element);
	var locvariables = variables;
	for(x in vars) locvariables[x] = vars[x];
	return Mustache.render(template, locvariables, partials);
}

M.loadTemplates = loadTemplates;
  M.getTemplate = getTemplate;
	M.tplStart		= tplStart;
	M.tplEnd			= tplEnd;
	M.addPartial	= addPartial;
	M.addFunction = addFunction;
	M.render			= render;
	return M;
})(Mustache);

var Domtotex = (function(Textpl){
	var M = {};

	// does element match the selector?

	var par = document;
	var el = par;
  // select element to be processed with css selector 
	var select = function(selector){
	  el = document.querySelector(selector);
		return el;
	}
	

	var escapes = {"\\":"\\textbackslash ",
		"~": "\\textasciitilde ",
		"^": "\\textasciicircum "
	}

	var  latexEscape = function(s){
		return s.replace(/([&%$#{}^_~\\])/g, function(x){
				return escapes[x] || "\\"+x;
		});
	}

	// 
	function getStyle(el, styleProp) {
		var value, defaultView = el.ownerDocument.defaultView;
		// W3C standard way:
		if (defaultView && defaultView.getComputedStyle) {
			// sanitize property name to css notation (hypen separated words eg. font-Size)
			styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
			return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
		} else if (el.currentStyle) { // IE
			// sanitize property name to camelCase
			styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
					return letter.toUpperCase();
					});
			value = el.currentStyle[styleProp];
			// convert other units to pixels on IE
			if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
				return (function(value) {
						var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
						el.runtimeStyle.left = el.currentStyle.left;
						el.style.left = value || 0;
						value = el.style.pixelLeft + "px";
						el.style.left = oldLeft;
						el.runtimeStyle.left = oldRsLeft;
						return value;
						})(value);
			}
			return value;
		}
	}
  
	M.select = select;
	M.latexEscape = latexEscape;
	M.getStyle = getStyle;
	return M;
})(Textpl);
