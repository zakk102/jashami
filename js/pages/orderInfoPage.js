//Filename: js/pages/orderInfoPage.js
(function(ImageResource, Scroller){
	var pageTemplate = [
		'<div class="HeaderPanel">',
			'<div><div class="HeaderButton BackButton"><span class="Pointer"></span><span class="Button">返回</span></div></div>',
			'<div id="title"></div>',
			'<div></div>',
		'</div>',
		'<div class="OrderInfoListTitle">',
			'<div><img src="'+ImageResource.ArrowDownIcon1+'"/><div>已點餐點</div></div>',
			'<div><img src="'+ImageResource.ArrowDownIcon1+'"/><div>數量</div></div>',
			'<div><img src="'+ImageResource.ArrowDownIcon1+'"/><div>價錢</div></div>',
		'</div>',
		'<div id="orderList" style="background-color:rgba(255, 255, 255, 0.75) ; -webkit-box-flex: 10;display: -webkit-box; -webkit-box-orient: horizontal;">',
		'</div>',
		'<div class="TotalMoneyPanel"><div>',
			'<div>總共</div>',
			'<div id="totalCount"></div>',
			'<div id="totalMoney"></div>',
			'<div></div>',
		'</div></div>',
		'<div class="OrderInfo Btns">',
			'<div class="Button" id="clearAllBtn"><div class="ButtonText">清除全部</div></div>',
			'<a class="Button" href="#checkOutPage"><div class="ButtonText">結帳</div></a>',
		'</div>'
	].join('');
	
	var OrderInfoPageView = Backbone.View.extend({
		initialize: function(){
			$(this.el).addClass('Base');
			$(this.el).attr("id","OrderInfoPageView");
			$(this.el).attr("style","height:100%; width:100%;");
			
			// scroller
			this.scroller = new Scroller();
			
			// this page
			$(this.el).html(_.template(pageTemplate));
		},
		setModel: function(model){
			if(model) this.model = model;
  			var that = this;
  			//  title
			var storeName = this.model.get('_displayedName');
			$("#title", this.el).html(storeName);
		},
		events:{
			"click .BackButton":"goBack",
			"click #clearAllBtn":"clearAll"
		},
		goBack: function(){
			if(window.inTransition) return;
			window.isGoBack = true;
			window.history.back();
		},
		clearAll: function(){
			
		},
		render: function(){
			// re-bind event
			this.scroller.render();
			this.delegateEvents();
			return this;
	  	}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.OrderInfoPageView = OrderInfoPageView;
})(	window.myapp.Images,
	window.myapp.Widget.Scroller);
