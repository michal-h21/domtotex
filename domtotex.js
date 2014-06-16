var Textpl = (function(Mustache){
var M = {};		

var partials = {};
var templates = {}
var tplStart = "<<";
var tplEnd   = ">>";
var brackets = "{{="+tplStart+" "+tplEnd+"=}}";

var loadTemplates = function(t){
  for(k in t){
    var v = templates[k] || [];
		templates[k] = v.concat(t[k]);
	}
}

var templateMaker = (function(){
  var name = "";
	var par  = {};
	var selector = "*";
	var pos = null;
	var create = function(n){
    name = n;
		selector = "*";
		pos = null;
		return this;
	}
	var position = function(p){pos = p; return this;}
	var selector = function(s){selector = s; return this}
	var tpl  = function(t){
    var c = {"selector": selector, "template":t}; 
    var x = templates[name] || [];
		if(pos)
      x.splice(pos, 0, c);
    else
		  x.push(c);
		templates[name] = x 
	}
	M.create = create;
	M.selector = selector;
	M.tpl  = tpl;
	return M;
}
)();

var addTemplate= function(name){ 
  return templateMaker.create(name)
}

var addPartial = function(name, tpl){
  partials[name] = brackets+tpl;
}


/*
for(x in partials){
	var p = partials[x];
	p =brackets+p;
	partials[x] = p;
}
*/

// this can be removed
var getVar = function(el){
	 log(el)
   return  el.replace(tplStart,"").replace(tplEnd,""); 
}

var variables = {}

var addFunction = function(name, fn){
	variables[name]=function(){ return fn};
}



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
	M.addTemplate = addTemplate;
  M.getTemplate = getTemplate;
	M.tplStart		= tplStart;
	M.brackets    = brackets;
	M.tplEnd			= tplEnd;
	M.variables		= variables;
	M.addPartial	= addPartial;
	M.addFunction = addFunction;
	M.render			= render;

	return M;
})(Mustache);


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


Textpl.addPartial("first", "<<#nth>>0<</nth>>")
Textpl.addPartial("second", "<<#nth>>1<</nth>>")

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

function reduceSpaces(t){
	return t.replace(/^\s+|\s+$/g, ' ');
}

function getText(element) {
    var text = [];
		//var template = getTemplate(element);
		var myvariables = {}//variables;
		var display = getStyle(element,'display');
		if(display =='none') return '';
		var myescape = latexEscape;
    //log(name+": "+ template);
    for (var i= 0, n= element.childNodes.length; i<n; i++) {
        var child= element.childNodes[i];
        if (child.nodeType===1 && child.tagName.toLowerCase()!=='script')
            text.push(getText(child));
        else if (child.nodeType===3)
            text.push(myescape(reduceSpaces(child.data)));
    }
    myvariables["content"] =  text.join('');
    myvariables["element"] = element;
    if(display=='block')
      return "\n" + Textpl.render(element, myvariables) + "\n";
    else
      return Textpl.render(element, myvariables) ;
}

  
	M.select = select;
	M.latexEscape = latexEscape;
	M.getStyle = getStyle;
	M.getText = getText;
	return M;
})(Textpl);
