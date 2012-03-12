// Filename: views/widget/touchWidget.js
(function(SETTINGS){
	var TouchWidget = Backbone.View.extend({
		initialize: function(){
			this._isEnabled = true;
			this._clickStart = false;
			this._lastX = null;
			this._lastY = null;
		},
		events: {
    		'mousedown': 'mouseDown',
    		'touchstart': 'touchStart',
    		'mousemove': 'mouseMove',
    		'touchmove': 'touchMove',
    		'mouseup': 'mouseUp',
    		'touchend': 'touchEnd',
  		},
  		mouseDown: function(e){
  			this.start(e.clientX, e.clientY);
  		},
  		touchStart: function(e){
  			this.start(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
  		},
  		mouseMove: function(e){
  			this.move(e.clientX, e.clientY);
  		},
  		touchMove: function(e){
  			this.move(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
  		},
  		mouseUp: function(e){
  			this.end(e.clientX, e.clientY);
  		},
  		touchEnd: function(e){
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
  		move: function(x, y){
  			if (this._isEnabled && x!=null && y!=null && this._lastX!=null && this._lastY!=null) {
	    		// skip small movement
	    		var varX = x - this._lastX;
	    		var varY = y - this._lastY;
	    		var thr = SETTINGS.OnMoveEventThreshold;
	    		if( (varX<=thr&&varX>=-thr) && (varY<=thr&&varY>=-thr) ){
	    			return;
	    		}
	    		
	    		_clickStart = false;
	    		$(this.el).removeClass('Pressed');
	    	}
  		},
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
})(window.myapp.Settings);
