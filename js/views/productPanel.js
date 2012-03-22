//Filename: js/views/ProductPanel.js
(function(Scroller){
	var pageTemplate = [
		'<div class="HeaderPanel">',
			'<div id="cancelBtn"><div class="HeaderButton"><div class="ButtonText">取消</div></div></div>',
			'<div id="title"></div>',
			'<div id="buyBtn"><div class="HeaderButton"><div class="ButtonText">購買</div></div></div>',
		'</div>',
	].join('');
	
	var ProductPanel = Backbone.View.extend({
		initialize: function(){
			this.tabs = {};
			$(this.el).html(_.template(pageTemplate));
			$(this.el).addClass('Base');
			$(this.el).attr("id","productPageView");
			$(this.el).attr("style","height:100%; width:100%;");
			$(this.el).css('background-image', 'url(pic/back-w.jpg)');
			$(this.el).css('z-index', '999');
			$(this.el).hide();
		},
		events:{
			"click #cancelBtn":"_cancel",
			"click #buyBtn":"_buy",
		},
		_cancel: function(){
			this.$el.hide();
			window.history.go(-1);
		},
		_buy: function(){
			this.$el.hide();
			window.history.go(-1);
		},
		render: function(){
			this.delegateEvents();
			return this;
	  	}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.View = window.myapp.View || {};
	window.myapp.View.ProductPanel = ProductPanel;
})( window.myapp.Widget.Scroller);
