// Filename: views/widget/scroller.js
(function(scrollLib){
	var Scroller = Backbone.View.extend({
		initialize: function(options){
			var opt = { hScrollbar: false, vScrollbar: false };
			for (i in options) opt[i] = options[i];
			
			this.container = document.createElement('div');
			this.content = document.createElement('div');
			this.container.appendChild(this.content);
			this.el = this.container;
			this.container.style.overflow = 'hidden';
			this.content.style.width = '100%';
			this.content.style.height = '100%';
			this.scroll = new scrollLib(this.container, opt);
			
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