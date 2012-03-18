// Filename: js/widget/touchWidget.js
(function(){
	var TouchWidget = Backbone.View.extend({
		initialize: function(){
			this._isEnabled = true;
			this._clickStart = false;
			this._lastX = null;
			this._lastY = null;
		},
		events: {
			'mouseout':'onMouseOut',
    		'mousedown':'mouseDown',
    		'touchstart':'touchStart',
    		'touchmove':'touchMove',
    		'mouseup':'mouseUp',
    		'touchend':'touchEnd',
  		},
  		onMouseOut: function(e){
  			this._clickStart = false;
	    	$(this.el).removeClass('Pressed');
  		},
  		mouseDown: function(e){
  			e.preventDefault();
			e.stopPropagation();
  			this.start(e.clientX, e.clientY);
  		},
  		touchStart: function(e){
  			e.preventDefault();
  			e.stopPropagation();
  			this.start(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
  			var target = e.target
  			while(!target.tagName) target=target.parentElement;
  			var rect = target.getBoundingClientRect();
  			this.topLeftX = rect.left;
  			this.topLeftY = rect.top;
  			this.bottomRightX = rect.left + target.clientWidth;
  			this.bottomRightY = rect.top + target.clientHeight;
  		},
  		touchMove: function(e){
  			e.preventDefault();
  			e.stopPropagation();
 /*
  			var target = e.target
  			while(!target.tagName) target=target.parentElement;
  			var rect = target.getBoundingClientRect();
  				var x = rect.left;
	 			var y = rect.top;
	  			var w = target.clientWidth;
	  			var h = target.clientHeight;
	  			var ex = e.changedTouches[0].pageX;
	  			var ey = e.changedTouches[0].pageY;
	  			if(ex<x || ex>x+w || ey<y || ey>y+h){
	  				this._clickStart = false;
		    		$(this.el).removeClass('Pressed');
	  			}
*/
			var ex = e.changedTouches[0].pageX;
	  		var ey = e.changedTouches[0].pageY;
			if(ex<this.topLeftX || ex>this.bottomRightX || ey<this.topLeftY || ey>this.bottomRightY){
  				this._clickStart = false;
	    		$(this.el).removeClass('Pressed');
  			}
  		},
  		mouseUp: function(e){
  			e.preventDefault();
			e.stopPropagation();
  			this.end(e.clientX, e.clientY);
  		},
  		touchEnd: function(e){
  			e.preventDefault();
  			e.stopPropagation();
  			this.end(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
  		},
  		start: function(x, y){
  			if (this._isEnabled && x!=null && y!=null) {
	    		this._lastX = x;
				this._lastY = y;
	            this._clickStart = true;
	            if(this.changeColorWhenTouch){ 
	            	$(this.el).addClass('Pressed');
	            }
    		}
  		},
/*  		move: function(x, y){
  			if (this._isEnabled && x!=null && y!=null && this._lastX!=null && this._lastY!=null) {
	    		// skip small movement
	    		var varX = x - this._lastX;
	    		var varY = y - this._lastY;
	    		var thr = SETTINGS.OnMoveEventThreshold;
	    		if( (varX<=thr&&varX>=-thr) && (varY<=thr&&varY>=-thr) ){
	    			return;
	    		}
	    		
	    		this._clickStart = false;
	    		$(this.el).removeClass('Pressed');
	    	}
  		},*/
  		end: function(x, y){
  			if (this._isEnabled && x!=null && y!=null) {
	    		this._lastX = null;
	    		this._lastY = null;
	    		if(this._clickStart){
	    			$(this.el).trigger('clickByTouch');
	    		}
	    		this._clickStart = false;
	    		$(this.el).removeClass('Pressed');
    		}
  		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Widget = window.myapp.Widget || {};
	window.myapp.Widget.TouchWidget = TouchWidget;
})();
