var Textpl = (function(Mustache){
var M = {};		
function getTemplate(element){
    var tplmatch, template;
    var name = element.nodeName.toLowerCase();
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
    template = "{{=<< >>=}}"+template;
		return template;
}
  M.getTemplate = getTemplate;
	return M;
})(Mustache);

var Domtotex = (function(Textpl){
	var M = {};

	// does element match the selector?
	var matches = function(el,selector){
		if(el.matches)
			return el.matches(selector);
		else if(el.mozMatchesSelector)
			return el.mozMatchesSelector(selector);
		else if(el.webkitMatchesSelector)
			return el.webkitMatchesSelector(selector);
	}

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
  
	M.matches = matches;
	M.select = select;
	M.latexEscape = latexEscape;
	M.getStyle = getStyle;
	return M;
})(Textpl);
