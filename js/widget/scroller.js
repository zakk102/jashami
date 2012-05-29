// Filename: js/widget/scroller.js
(function(DeviceType, ImageResource, scrollLib){
	var loading_label="更新中...";
	var refresh_label="放開後馬上更新";
	var pulldown_label="向下拉可以更新";
	var pullup_label="向上推可以更新";
	var Scroller = Backbone.View.extend({
		initialize: function(){
			var opt = { hScrollbar: false, vScrollbar: false };
			
			this.container = document.createElement('div');
			this.content = document.createElement('div');
			this.container.appendChild(this.content);
			this.el = this.container;
			$(this.el).addClass('scroller');
			$(this.el).css('-webkit-box-flex', '1');
			this.container.style.overflow = 'hidden';
			this.content.style.width = '100%';
			this.scroll = new scrollLib(this.container, opt);
			$(this.el).css('position', 'absolute');
			$(this.el).css('height', '100%');
			$(this.el).css('width', '100%');
			
			var that = this;
			var refresh = function(e){
				console.log('refresh scroller by: ' + e.type);
				that.scroll.refresh(e.type);
				// fix: Preventing event from bubbling up to iScroll, as it would then remove it.
				[].slice.call(that.content.querySelectorAll('input, select, button, textarea')).forEach(function(el){
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
  			var wtd = 500;
  			if(DeviceType.getDeviceType()==DeviceType.Android) wtd = 0;
  			if(pullDownEl) pullDownEl.html('<div id="pulldown-icon" class="icon" style="-webkit-transition-duration:'+wtd+'ms; -webkit-mask-box-image:url('+ImageResource["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_212_down_arrow"]+')"></div><div class="pullDownLabel refresh-label">'+pulldown_label+'</div>');
  			if(pullUpEl) pullUpEl.html('<div id="pullup-icon" class="icon"></div><div class="pullUpLabel refresh-label">'+pullup_label+'</div>');
  			
  			this.render({
				useTransition: true,
				topOffset: pullDownOffset,
				onRefresh: function () {
					if (pullDownEl && pullDownEl.hasClass('loading')) {
						pullDownEl.removeClass('loading');
						$('.pullDownLabel', pullDownEl).html(pulldown_label);
					} else if (pullUpEl && pullUpEl.hasClass('loading')) {
						pullUpEl.removeClass('loading');
						$('.pullUpLabel', pullUpEl).html('Pull up to load more...');
					}
				},
				onScrollMove: function () {
					if (pullDownEl && this.y > 10 && !pullDownEl.hasClass('flip')) {
						pullDownEl.addClass('flip');
						$('.pullDownLabel', pullDownEl).html(refresh_label);
						$('.icon', pullDownEl).css('-webkit-transform','rotate(-180deg)');
						this.minScrollY = 0;
					} else if (pullDownEl && this.y < 10 && pullDownEl.hasClass('flip')) {
						pullDownEl.removeClass('flip');
						$('.pullDownLabel', pullDownEl).html(pulldown_label);
						this.minScrollY = -pullDownOffset;
					} else if (pullUpEl && this.y < (this.maxScrollY - 10) && !pullUpEl.hasClass('flip')) {
						pullUpEl.addClass('flip');
						$('.pullUpLabel', pullUpEl).html(refresh_label);
						this.maxScrollY = this.maxScrollY;
					} else if (pullUpEl && this.y > (this.maxScrollY + 10) && pullUpEl.hasClass('flip')) {
						pullUpEl.removeClass('flip');
						$('.pullUpLabel', pullUpEl).html('Pull up to load more...');
						this.maxScrollY = pullUpOffset;
					}
				},
				onScrollEnd: function () {
					if (pullDownEl && pullDownEl.hasClass('flip')) {
						pullDownEl.removeClass('flip').addClass('loading');
						$('.pullDownLabel', pullDownEl).html(loading_label);
						$('.icon', pullDownEl).css('-webkit-transform','rotate(0deg)');
						pullDownAction();	// Execute custom function (ajax call?)
					} else if (pullUpEl && pullUpEl.hasClass('flip')) {
						pullUpEl.removeClass('flip').addClass('loading');
						$('.pullUpLabel', pullUpEl).html(loading_label);
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
			[].slice.call(this.content.querySelectorAll('input, select, button, textarea')).forEach(function(el){
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
})(	window.myapp.Utils.DeviceType,
	window.myapp.Images,
	iScroll);