// Filename: views/widget/touchWidget.js
(function(){
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
  			console.log('ww');
  			if (this._isEnabled && x!=null && y!=null) {
  				console.log('qq');
	    		this._lastX = x;
				this._lastY = y;
	            this._clickStart = true;
	            if(this.changeColorWhenTouch){ 
	            	console.log('Pressed');
	            	$(this.el).addClass('Pressed');
	            }
    		}
  		},
  		move: function(x, y){
  		},
  		end: function(x, y){
  		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Widget = window.myapp.Widget || {};
	window.myapp.Widget.TouchWidget = TouchWidget;
})();
