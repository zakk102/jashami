//Filename: js/pages/orderInfoPage.js
(function(ImageResource, Scroller, ProductPanel){
	var pageTemplate = [
		'<div class="header-wrap">',
			'<div class="header-shadow"></div>',
			'<div class="header-outer">',
				'<div class="header">',
					'<div class="center">',
						'<div class="BackButton">',
							'<div class="link-wrap"><div id="back-link" class="icon"></div><div class="function-txt">返回</div></div>',					
						'</div>',
						'<div id="title" class="function-panel">',
						'</div>',
						'<div class="NextButton">',
							'<a class="checkOutBtn link-wrap" href="#userInfoPage"><div id="buy" class="icon"></div><div class="function-txt">購買</div></a>',					
						'</div>',
					'</div>',
				'</div>',
			'</div>',
		'</div>',
		'<div class="order-info-list-panel">',
			'<div class="TotalMoneyPanel"><div>',
				'<div>總共</div>',
				'<div class="totalCount"></div>',
				'<div class="totalMoney"></div>',
				'<div></div>',
			'</div></div>',
			// '<div class="OrderInfoListTitle">',
				// '<div><div class="AccordionArrow"></div><div>已點餐點</div></div>',
				// '<div><div class="AccordionArrow"></div><div>數量</div></div>',
				// '<div><div class="AccordionArrow"></div><div>價錢</div></div>',
			// '</div>',
			'<div class="OrderListPanel"></div>',
	//		'<div id="orderList" style="-webkit-box-flex: 10;display: -webkit-box; -webkit-box-orient: horizontal;">',
			// '</div>',
			// '<div class="OrderInfo Btns">',
				// '<div class="Button" id="clearAllBtn">',
					// '<div id="clear-icon" class="icon"></div>',
					// '<div class="ButtonText">清除全部</div>',
				// '</div>',
				// '<div class="Button checkOutBtn">',
					// '<div id="buy-icon" class="icon"></div>',
					// '<div class="ButtonText">購買</div>',
				// '</div>',
				// '<a class="Button" ><div class="ButtonText">結帳</div></a>',
			// '</div>',
		'</div>'
	].join('');
	
	var orderInfoListTemplate = [
		'<div class="OrderInfoList">',
			'<% for(var i=0, length=shoppingCart.get("buyList").length; i<length; i++){ %>',
			'<% var buyList = shoppingCart.get("buyList") %>',
			'<div class="order-item-wrap">',
				'<div id="removeItem" class="icon" index="<%= i %>" ></div>',
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
					'<div class="BuyAmount"><%= buyList.at(i).get("amount") %>份</div>',
					'<div class="BuyPrice"><%= buyList.at(i).get("singlePrice") * buyList.at(i).get("amount") %>元</div>',
				'</div>',
				'<div id="updateItem" class="icon" index="<%= i %>"></div>',
			'</div>',
			'<% } %>',
		'</div>'
	].join('');
	
	var OrderInfoPageView = Backbone.View.extend({
		initialize: function(){
			$(this.el).addClass('Base');
			$(this.el).attr("id","OrderInfoPageView");
			
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
			$('.checkOutBtn', this.el).attr('href', '#userInfoPage/'+this.model.id);
			
			this.resetDisplayedData();
		},
		events:{
			"click .BackButton":"goBack",
			"click #clearAllBtn":"clearAll",
			"click .checkOutBtn":"checkOut",
			"click #updateItem":"updateItem",
			"click #removeItem":"removeItem"
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
			
			$('.totalCount', this.el).html(shoppingCart.get('amount')+'份');
			$('.totalMoney', this.el).html(shoppingCart.get('sum')+'元');			
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