// Filename: js/pages/historyTab.js
(function(Scroller){
	var tabTemplate = [
		'<div id="pullDown"></div>',
		'<div class="OrderHistory">',
			'<div>',
				'<div class="gwt-Label">點餐紀錄:</div>',
				'<div class="OrderHistoryPanelTitle">',
					'<div class="gwt-Label">✭</div>',
					'<div class="gwt-Label">送餐時間</div>',
					'<div class="gwt-Label">編號</div>',
					'<div class="gwt-Label">狀態</div>',
				'</div>',
			'</div>',
			'<div class="Accordion OrderHistoryPanel"></div>',
		'</div>',
		'<div id="pullUp"></div>',
	].join('');
	
	var HistoryTabView = Backbone.View.extend({
		initialize: function(){
			var scroller = new Scroller();
			scroller.html(_.template(tabTemplate));
			$(this.el).html(scroller.el);
			$(this.el).css('background-color', 'rgba(255, 255, 255, 0.75)');
			$(this.el).css('display', '-webkit-box');	
			$(scroller.el).css('width', '100%');
			$('.OrderHistoryPanel', this.el).css('minHeight', window.clientHeight);
			
			pullDownEl = $('#pullDown', this.el);
			pullDownOffset = 30;
			pullUpEl = $('#pullUp', this.el);
			pullUpOffset = 30;
			var that = this;
			var pullUpAction = function(){
				setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
					el = $('.OrderHistoryPanel', that.el);
					for (i=0; i<3; i++) {
						el.append('<li>Generated row</li>');
					}
					scroller.render();		// Remember to refresh when contents are loaded (ie: on ajax completion)
				}, 1000);
			}
			var pullDownAction = function(){
				setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
					el = $('.OrderHistoryPanel', that.el);
					for (i=0; i<3; i++) {
						el.prepend('<li>Generated row</li>');
					}
					scroller.render();		// Remember to refresh when contents are loaded (ie: on ajax completion)
				}, 1000);
			}
			scroller.setPullToRefresh({
				pullDownEl: pullDownEl, 
				pullDownAction: pullDownAction
			});
		},
		render: function(){
			return this;
	    }
	});
	
	window.myapp = window.myapp || {};
	window.myapp.HistoryTabView = HistoryTabView;
})(window.myapp.Widget.Scroller);
