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
    		var result = (/translate(3d)?\((\-?.*)px, (\-?.*)px, (\-?.*)px\)( scale\((\d)\))?/).exec(transform);
    		if(result) left = -parseInt(result[2]);
    	}
		return left;
	};
	Utils.getTranslateY = function(elem){
		var top = 0;
		var transform = elem.style.webkitTransform;
    	if (transform && transform !== "") {
    		var result = (/translate(3d)?\((\-?.*)px, (\-?.*)px, (\-?.*)px\)( scale\((\d)\))?/).exec(transform);
        	if(result) top = -parseInt(result[3]);
    	}    
		return top;
	};
	Utils.StringEndsWith = function(str, suffix){
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	};
	Utils.getDistanceFromLatLng = function(lat0, lng0, lat1, lng1){
		var R = 6371; // km
		var dLat = (lat2-lat1) * Math.PI / 180;
		var dLng = (lng2-lng1) * Math.PI / 180;
		var lat1 = lat1 * Math.PI / 180;
		var lat2 = lat2 * Math.PI / 180;

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      			Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;
		return d;
	}
	
	window.myapp = window.myapp || {};
	window.myapp.Utils = Utils;
})();