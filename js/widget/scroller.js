// Filename: js/widget/scroller.js
(function(scrollLib){
	var Scroller = Backbone.View.extend({
		initialize: function(){
			var opt = { hScrollbar: false, vScrollbar: false };
			
			this.container = document.createElement('div');
			this.content = document.createElement('div');
			this.container.appendChild(this.content);
			this.el = this.container;
			this.container.style.overflow = 'hidden';
			this.content.style.width = '100%';
			this.content.style.height = '100%';
			this.scroll = new scrollLib(this.container, opt);
			
			var that = this;
			var refresh = function(e){
				console.log('refresh scroller by: ' + e.type);
				that.scroll.refresh(e.type);
				// fix: Preventing event from bubbling up to iScroll, as it would then remove it.
				[].slice.call(that.content.querySelectorAll('input, select, button')).forEach(function(el){
					el.addEventListener(('ontouchstart' in window)?'touchstart':'mousedown', function(e){
						e.stopPropagation();
					});
				});
			};
//			$(this.container).bind('DOMNodeInsertedIntoDocument', refresh);
//			$(window).bind('resize', refresh);
		},
  		html: function(html){
  			$(this.content).html(html);
  		},
  		getContent: function(){
  			return $(this.content);
  		},
  		setPullToRefresh: function(options){
  			var opt = {
  				pullDownOffset: 30,
  				pullUpOffset: 30
  			};
  			for(i in options) opt[i] = options[i];
  			pullDownEl = opt.pullDownEl;
  			pullUpEl = opt.pullUpEl;
  			pullDownOffset = opt.pullDownOffset;
  			pullUpOffset = opt.pullUpOffset;
  			pullUpAction = opt.pullUpAction;
  			pullDownAction = opt.pullDownAction;
  			if(pullDownEl) pullDownEl.html('<span class="pullDownIcon"></span><span class="pullDownLabel">Pull down to refresh...</span>');
  			if(pullUpEl) pullUpEl.html('<span class="pullUpIcon"></span><span class="pullUpLabel">Pull up to refresh...</span>');
  			
  			this.render({
				useTransition: true,
				topOffset: pullDownOffset,
				onRefresh: function () {
					if (pullDownEl && pullDownEl.hasClass('loading')) {
						pullDownEl.removeClass('loading');
						$('.pullDownLabel', pullDownEl).html('Pull down to refresh...');
					} else if (pullUpEl && pullUpEl.hasClass('loading')) {
						pullUpEl.removeClass('loading');
						$('.pullUpLabel', pullUpEl).html('Pull up to load more...');
					}
				},
				onScrollMove: function () {
					if (pullDownEl && this.y > 5 && !pullDownEl.hasClass('flip')) {
						pullDownEl.addClass('flip');
						$('.pullDownLabel', pullDownEl).html('Release to refresh...');
						this.minScrollY = 0;
					} else if (pullDownEl && this.y < 5 && pullDownEl.hasClass('flip')) {
						pullDownEl.removeClass('flip');
						$('.pullDownLabel', pullDownEl).html('Pull down to refresh...');
						this.minScrollY = -pullDownOffset;
					} else if (pullUpEl && this.y < (this.maxScrollY - 5) && !pullUpEl.hasClass('flip')) {
						pullUpEl.addClass('flip');
						$('.pullUpLabel', pullUpEl).html('Release to refresh...');
						this.maxScrollY = this.maxScrollY;
					} else if (pullUpEl && this.y > (this.maxScrollY + 5) && pullUpEl.hasClass('flip')) {
						pullUpEl.removeClass('flip');
						$('.pullUpLabel', pullUpEl).html('Pull up to load more...');
						this.maxScrollY = pullUpOffset;
					}
				},
				onScrollEnd: function () {
					if (pullDownEl && pullDownEl.hasClass('flip')) {
						pullDownEl.removeClass('flip').addClass('loading');
						$('.pullDownLabel', pullDownEl).html('Loading...');
						pullDownAction();	// Execute custom function (ajax call?)
					} else if (pullUpEl && pullUpEl.hasClass('flip')) {
						pullUpEl.removeClass('flip').addClass('loading');
						$('.pullUpLabel', pullUpEl).html('Loading...');
						pullUpAction();	// Execute custom function (ajax call?)
					}
				}
			});
  		},
  		scrollTo: function(x, y, time){
  			if(!time) time = 300;
  			this.scroll.scrollTo(-x, -y, time);
  		},
  		scrollToElement: function(el, time){
  			if(!time) time = 300;
  			this.scroll.scrollToElement(el, time);
  		},
		render: function(options){
			if(options) this.scroll.setOption(options);
			else this.scroll.refresh('re-bind event');
			// fix: Preventing event from bubbling up to iScroll, as it would then remove it.
			[].slice.call(this.content.querySelectorAll('input, select, button')).forEach(function(el){
				el.addEventListener(('ontouchstart' in window)?'touchstart':'mousedown', function(e){
					e.stopPropagation();
				});
			});
			return this;
		}
	});
		
	window.myapp = window.myapp || {};
	window.myapp.Widget = window.myapp.Widget || {};
	window.myapp.Widget.Scroller = Scroller;
})(iScroll);