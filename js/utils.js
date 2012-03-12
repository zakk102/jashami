// Filename: utils.js
// TODO: need better way to getTranslateX & getTranslateY
//
(function(){
	var Utils = {};
	Utils.getAbsoluteLeft = function(elem){
		var left = 0;
    	var curr = elem;
    	// This intentionally excludes body which has a null offsetParent.    
	    while (curr.offsetParent) {
	      left -= Utils.getTranslateX(curr);
	      left -= curr.scrollLeft;
	      curr = curr.parentNode;
	    }
	    while (elem) {
	      left += elem.offsetLeft;
	      elem = elem.offsetParent;
	    }
	    return left;
	};
	Utils.getAbsoluteTop = function(elem){
		var top = 0;
	    var curr = elem;
	    // This intentionally excludes body which has a null offsetParent.    
	    while (curr.offsetParent) {
	      top -= Utils.getTranslateY(curr);
	      top -= curr.scrollTop;
	      curr = curr.parentNode;
	    }
	    while (elem) {
	      top += elem.offsetTop;
	      elem = elem.offsetParent;
	    }
	    return top;
	};
	Utils.getTranslateX = function(elem){
		var left = 0;
		var transform = elem.style.webkitTransform;
    	if (transform && transform !== "") {
    		var result = (/translate3d\((\-?.*)px, (\-?.*)px, 0px\) scale\(1\)/).exec(transform);
    		if(result) left = -parseInt(result[1]);
    	}
		return left;
	};
	Utils.getTranslateY = function(elem){
		var top = 0;
		var transform = elem.style.webkitTransform;
    	if (transform && transform !== "") {
    		var result = (/translate3d\((\-?.*)px, (\-?.*)px, 0px\) scale\(1\)/).exec(transform);
        	if(result) top = -parseInt(result[2]);
    	}    
		return top;
	};
	Utils.StringEndsWith = function(str, suffix){
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	};
	
	window.myapp = window.myapp || {};
	window.myapp.Utils = Utils;
})();