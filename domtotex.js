var pokus = (function(){
	var pokus= "init";
	var m = {};
	m.ahoj = function(s){
		pokus = s;
		return this;
	}
	m.print= function(){
		return pokus;
	}
	return m;
})()
