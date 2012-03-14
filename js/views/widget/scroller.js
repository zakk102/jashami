// Filename: views/widget/scroller.js
(function(scrollLib){
	var Scroller = Backbone.View.extend({
		initialize: function(){
			this.container = document.createElement('div');
			this.content = document.createElement('div');
			this.container.appendChild(this.content);
			this.el = this.container;
			this.container.style.overflow = 'hidden';
			this.content.style.width = '100%';
			this.content.style.height = '100%';
			this.scroll = new scrollLib(this.container, { hScroll: true, vScroll: true });
			var that = this;
			var refresh = function(){
				that.scroll.refresh();
				// fix: Preventing event from bubbling up to iScroll, as it would then remove it.
				[].slice.call(that.content.querySelectorAll('input, select, button')).forEach(function(el){
					el.addEventListener(('ontouchstart' in window)?'touchstart':'mousedown', function(e){
						e.stopPropagation();
					});
				});
			};
			$(this.container).live('DOMNodeInsertedIntoDocument', refresh);
			$(this.container).resize(refresh);
		},
		events: {
  		},
  		html: function(html){
  			$(this.content).html(html);
  		},
		render: function(){
		}
	});
		
	window.myapp = window.myapp || {};
	window.myapp.Widget = window.myapp.Widget || {};
	window.myapp.Widget.Scroller = Scroller;
})(iScroll);

/*
(function(ScrollerLib, RenderFun){
	var Scroller = Backbone.View.extend({
		initialize: function(){
			this.render();
		},
		events: {
  		},
  		html: function(html){
  			$(this.content).html(html);
  		},
		render: function(tab){
			var container = document.createElement("div");
			this.container = container;
			this.content = document.createElement("div");
			container.appendChild(this.content);
			container.id = 'container';
			container.style.backgroundColor = 'rgba(255, 255, 255, 0.75)';
			container.style.overflow = 'hidden';
			this.el = container;
			var scroller = new ScrollerLib(RenderFun, {
				scrollingX: false,
				scrollingY: true
			});
			this.scroller = scroller;
			this.content.style[EasyScroller.vendorPrefix + 'TransformOrigin'] = "left top";
			scroller.setDimensions(container.clientWidth, container.clientHeight, this.content.offsetWidth, this.content.offsetHeight);
			var rect = container.getBoundingClientRect();
			scroller.setPosition(rect.left+container.clientLeft, rect.top+container.clientTop);
			
			
			var that = this;

	// reflow handling
	window.addEventListener("resize", function() {
		that.reflow();
	}, false);

	// touch devices bind touch events
	if ('ontouchstart' in window) {

		container.addEventListener("touchstart", function(e) {

			// Don't react if initial down happens on a form element
			if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
				return;
			}

			that.scroller.doTouchStart(e.touches, e.timeStamp);
			e.preventDefault();

		}, false);

		document.addEventListener("touchmove", function(e) {
			that.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
		}, false);

		document.addEventListener("touchend", function(e) {
			that.scroller.doTouchEnd(e.timeStamp);
		}, false);

		document.addEventListener("touchcancel", function(e) {
			that.scroller.doTouchEnd(e.timeStamp);
		}, false);

	// non-touch bind mouse events
	} else {
		
		var mousedown = false;

		this.container.addEventListener("mousedown", function(e) {

			if (e.target.tagName.match(/input|textarea|select/i)) {
				return;
			}
		
			that.scroller.doTouchStart([{
				pageX: e.pageX,
				pageY: e.pageY
			}], e.timeStamp);

			mousedown = true;
			e.preventDefault();

		}, false);

		document.addEventListener("mousemove", function(e) {

			if (!mousedown) {
				return;
			}
			
			that.scroller.doTouchMove([{
				pageX: e.pageX,
				pageY: e.pageY
			}], e.timeStamp);

			mousedown = true;

		}, false);

		document.addEventListener("mouseup", function(e) {

			if (!mousedown) {
				return;
			}
			
			that.scroller.doTouchEnd(e.timeStamp);

			mousedown = false;

		}, false);

		this.container.addEventListener("mousewheel", function(e) {
			if(that.options.zooming) {
				var delta = e.detail? e.detail*(-120) : e.wheelDelta
				that.scroller.doMouseZoom(delta, e.timeStamp, e.pageX, e.pageY);	
				e.preventDefault();
			}
		}, false);

	}
	   }
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Widget = window.myapp.Widget || {};
	window.myapp.Widget.Scroller = Scroller;
})(Scroller, Render);


var Render = (function(global) {
	var docStyle = document.documentElement.style;
	
	var engine;
	if (global.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
		engine = 'presto';
	} else if ('MozAppearance' in docStyle) {
		engine = 'gecko';
	} else if ('WebkitAppearance' in docStyle) {
		engine = 'webkit';
	} else if (typeof navigator.cpuClass === 'string') {
		engine = 'trident';
	}
	
	var vendorPrefix = {
		trident: 'ms',
		gecko: 'Moz',
		webkit: 'Webkit',
		presto: 'O'
	}[engine];
	
	var helperElem = document.createElement("div");
	var undef;

	var perspectiveProperty = vendorPrefix + "Perspective";
	var transformProperty = vendorPrefix + "Transform";
	
	if (helperElem.style[perspectiveProperty] !== undef) {
		
		return function(left, top, zoom) {
			content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
		};	
		
	} else if (helperElem.style[transformProperty] !== undef) {
		
		return function(left, top, zoom) {
			content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
		};
		
	} else {
		
		return function(left, top, zoom) {
			content.style.marginLeft = left ? (-left/zoom) + 'px' : '';
			content.style.marginTop = top ? (-top/zoom) + 'px' : '';
			content.style.zoom = zoom || '';
		};
		
	}
})(this);
*/