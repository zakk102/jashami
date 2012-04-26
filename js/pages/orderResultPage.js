//Filename: js/pages/orderResultPage.js
(function(Scroller){
	var pageTemplate = [
		'<div class="HeaderPanel">',
			'<div></div>',
			'<div id="title"></div>',
			'<div><div class="HeaderButton NextButton"><span class="Button">回首頁</span><span class="Pointer"></span></div></div>',
		'</div>',
		'<div id="orderResult" style="color: #000; -webkit-box-flex: 10;display: -webkit-box; -webkit-box-orient: horizontal;">',
		'</div>'
	].join('');
	
	var orderResultTemplate = [
		'<div class="FinishPanel">',
			'<img src="data:image/png;base64,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" class="gwt-Image" style="margin-top: 20px; ">',
			'<div class="gwt-Label">您的訂單已經傳送到行甲蝦米 - 外送得來速</div>',
			'<div class="gwt-Label">編號：<%= orderNumber %></div>',
			'<div class="gwt-Label">您可隨時到『點餐紀錄』查詢處理狀態</div>',
		'</div>'	
	].join('');
	
	var OrderResultPageView = Backbone.View.extend({
		initialize: function(){			
			$(this.el).addClass('Base');
			$(this.el).attr('id', 'OrderResultPageView');
			$(this.el).attr('style', 'color:#000; height:100%; width:100%;');
			
			// scroller
			this.scroller = new Scroller();
			$(this.scroller.el).css('width', '100%');
					
			// this page
			$(this.el).html(_.template(pageTemplate));
			$('#orderResult', this.el).html(this.scroller.render().el);
			this.scroller.html(_.template(orderResultTemplate, { orderNumber:0 }));			
		},
		events:{
			"click .NextButton":"homePage"
		},
		homePage: function(){
			location.href = '#startPage';
		},
		setStore: function(store){
			this.store = store;
		},
		setOrderNumber: function(orderNumber){
			this.orderNumber = orderNumber;
		},
		cleanShoppingCart: function(store){
			window.shoppingCartCollection.get(store).get('buyList').reset();
			window.shoppingCartCollection.get(store).updateDisplay();
		},
		render: function(){
			// re-bind event
			$('#title', this.el).html(this.store);
			this.scroller.html(_.template(orderResultTemplate, { orderNumber:this.orderNumber }));
			this.scroller.render();
			this.delegateEvents();
			return this;
		}
	});
	window.myapp = window.myapp || {};
	window.myapp.OrderResultPageView = OrderResultPageView;
})(window.myapp.Widget.Scroller);
