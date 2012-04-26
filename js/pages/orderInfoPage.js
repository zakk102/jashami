//Filename: js/pages/orderInfoPage.js
(function(ImageResource, Scroller, ProductPanel){
	var pageTemplate = [
		'<div class="HeaderPanel">',
			'<div><div class="HeaderButton BackButton"><span class="Pointer"></span><span class="Button">返回</span></div></div>',
			'<div id="title"></div>',
			'<div></div>',
		'</div>',
		'<div class="OrderInfoListTitle">',
			'<div><div class="AccordionArrow"></div><div>已點餐點</div></div>',
			'<div><div class="AccordionArrow"></div><div>數量</div></div>',
			'<div><div class="AccordionArrow"></div><div>價錢</div></div>',
		'</div>',
		'<div class="OrderListPanel" style="color:#000; background-color:rgba(255, 255, 255, 0.75); -webkit-box-flex: 10;display: -webkit-box; -webkit-box-orient: horizontal; position: relative;"></div>',
//		'<div id="orderList" style="-webkit-box-flex: 10;display: -webkit-box; -webkit-box-orient: horizontal;">',
		'</div>',
		'<div class="TotalMoneyPanel"><div>',
			'<div>總共</div>',
			'<div class="totalCount"></div>',
			'<div class="totalMoney"></div>',
			'<div></div>',
		'</div></div>',
		'<div class="OrderInfo Btns">',
			'<div class="Button" id="clearAllBtn"><div class="ButtonText">清除全部</div></div>',
			'<a class="Button" id="checkOutBtn"><div class="ButtonText">結帳</div></a>',
		'</div>'
	].join('');
	
	var orderInfoListTemplate = [
		'<div class="OrderInfoList">',
			'<% for(var i=0, length=shoppingCart.get("buyList").length; i<length; i++){ %>',
			'<% var buyList = shoppingCart.get("buyList") %>',
			'<div>',
				'<img class="removeItem" index="<%= i %>" src="data:image/png;base64,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"></img>',
				'<div class="BuyItemCell">',
					'<div class="ProductInfoPanel">',
						'<div class="ProductName"><%= buyList.at(i).get("productNameId") %></div>',
						'<div class="OptionPanel">',
							'<% var selectedOptions = buyList.at(i).get("selectedOptions"); %>',
							'<% for(var key in selectedOptions){ %>',
								'<div><%=  key %>：<%=  selectedOptions[key] %></div>',
							'<% } %>',
						'</div>',
					'</div>',
					'<div class="BuyAmount"><%= buyList.at(i).get("amount") %></div>',
					'<div class="BuyPrice"><%= buyList.at(i).get("singlePrice") * buyList.at(i).get("amount") %>元</div>',
				'</div>',
				'<img class="updateItem" index="<%= i %>" src="data:image/png;base64,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"></img>',
			'</div>',
			'<% } %>',
		'</div>'
	].join('');
	
	var OrderInfoPageView = Backbone.View.extend({
		initialize: function(){
			$(this.el).addClass('Base');
			$(this.el).attr("id","OrderInfoPageView");
			$(this.el).attr("style","height:100%; width:100%;");
			
			// scroller
			var scroller = new Scroller();
			this.scroller = scroller;
			
			// this page
			$(this.el).html(_.template(pageTemplate));
		},
		setModel: function(model){
			if(model) this.model = model;
  			var that = this;
  			//  title
			var storeName = this.model.get('displayedName');
			$("#title", this.el).html(storeName);
			
			// check out url
			$('#checkOutBtn', this.el).attr('href', '#userInfoPage/'+this.model.id);
			
			this.resetDisplayedData();
		},
		events:{
			"click .BackButton":"goBack",
			"click #clearAllBtn":"clearAll",
			"click #checkOutBtn":"checkOut",
			"click .updateItem":"updateItem",
			"click .removeItem":"removeItem"
		},
		goBack: function(){
			if(window.inTransition) return;
			window.isGoBack = true;
			window.history.back();
		},
		clearAll: function(){
			var storeNameId = this.model.get('storeNameId');
			var shoppingCart = window.shoppingCartCollection.get(storeNameId);
			
			shoppingCart.clearBuyList();
		},
		checkOut: function(e){
			var storeNameId = this.model.get('storeNameId');
			var shoppingCart = window.shoppingCartCollection.get(storeNameId);
			var sum = shoppingCart.get('sum');
			var deliveryLimit = shoppingCart.get('deliveryLimit');
			
			if(sum < deliveryLimit){
				alert('未達外送額度');
				e.preventDefault();
			}
		},
		updateItem: function(e){
			var index = e.currentTarget.getAttribute("index");
			var storeNameId = this.model.get('storeNameId');
			var item = window.shoppingCartCollection.get(storeNameId).get('buyList').at(index);
			var pid = item.get('productNameId');
			var product = window.menuData.get('stores').get(storeNameId).get('menuId').get('products').get(pid);
			
			var productPanel = window.productPanel;
			productPanel.show('top', {text:'確定', action:function(){
				productPanel.hide('bottom', function() {
					//get shoppingCart
					if(!window.shoppingCartCollection) window.shoppingCartCollection = new ShoppingCartCollection();
					var shoppingCarts = window.shoppingCartCollection;
					var shoppingCart = shoppingCarts.get(productPanel.storeNameId);
					if(!shoppingCart){
						var deliveryLimit = productPanel.model.get('deliveryLimit');
						shoppingCart = new ShoppingCartData({storeNameId:storeNameId, deliveryLimit:deliveryLimit});
						shoppingCarts.add(shoppingCart);
					}
					//update product to shoppingCart
					item.set('selectedOptions', $.extend({},productPanel.selectedOption));
					item.set('singlePrice', productPanel.selectedPrice);
					item.set('amount', productPanel.amount);
					shoppingCart.updateBuyItem(item);
					
					window.history.go(-1);
				});
			}});
			window.productPanel.setModel(product, storeNameId, item);
						
			// push state to url
			var href = window.location.hash+'/'+index;
			Backbone.history.navigate(href, {trigger: false, replace: false});
		},
		removeItem: function(e){
			var index = e.currentTarget.getAttribute("index");
			var storeNameId = this.model.get('storeNameId');
			var shoppingCart = window.shoppingCartCollection.get(storeNameId);
			var item = shoppingCart.get('buyList').at(index);
			
			shoppingCart.removeBuyItem(item);
		},
		resetDisplayedData: function(){
			var storeNameId = this.model.get('storeNameId');
			var shoppingCart = window.shoppingCartCollection.get(storeNameId);
			this.scroller.html(_.template(orderInfoListTemplate, { 'shoppingCart':shoppingCart }));
			
			$('.OrderListPanel', this.el).html(this.scroller.render().el);
			$(this.scroller.el).css('width', '100%');
			
			$('.totalCount', this.el).html(shoppingCart.get('amount'));
			$('.totalMoney', this.el).html(shoppingCart.get('sum'));			
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
	window.myapp.Widget.Scroller,
	window.myapp.View.ProductPanel);
