//Filename: js/pages/orderInfoPage.js
(function(ImageResource, Scroller, ProductPanel, ShoppingCartData, ShoppingCartCollection, TouchWidget){
	var pageTemplate = [
		'<div class="header-wrap">',
			'<div class="header-shadow"></div>',
			'<div class="header-outer">',
				'<div class="header">',
					'<div class="center" style="background:url('+ImageResource["pic/paper_light_yellow"]+') repeat scroll 0 0;">',
						'<div class="BackButton">',
							'<div class="link-wrap" id="back-link-wrap" ><div id="back-link" class="icon" style="-webkit-mask-box-image:url('+ImageResource["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_216_circle_arrow_left"]+');"></div><div class="function-txt">返回</div></div>',					
						'</div>',
						'<div id="title" class="function-panel">',
						'</div>',
						'<div class="NextButton">',
							'<a id="buy-link-wrap" class="checkOutBtn link-wrap" href="#userInfoPage"><div id="buy" class="icon" style="-webkit-mask-box-image:url('+ImageResource["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_227_usd"]+');"></div><div class="function-txt">購買</div></a>',					
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
				'<div id="removeItem" class="icon" index="<%= i %>" style="-webkit-mask-box-image:url('+ImageResource["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_197_remove"]+');"></div>',
				'<% var orderName = buyList.at(i).get("orderName"); %>',
				'<% if(orderName && orderName.length>0){ %>',
				'<div class="name"><%= orderName %></div>',
				'<% } %>',
				'<div class="BuyItemCell">',
					'<div class="ProductInfoPanel">',
						'<% var pid = buyList.at(i).get("productNameId"); pid = pid.substring(pid.indexOf("_")+1); %>',
						'<div class="ProductName"><%= pid %></div>',
						'<div class="OptionPanel">',
							'<% var selectedOptions = buyList.at(i).get("selectedOptions"); %>',
							'<% for(var key in selectedOptions){ %>',
								'<div><%=  key %>：<%=  selectedOptions[key] %></div>',
							'<% } %>',
							'<% var remarks = buyList.at(i).get("remarks"); %>',
							'<% if(remarks && remarks.length>0){ %>',
							'<div>附註：<%= remarks %></div>',
							'<% } %>',
						'</div>',
					'</div>',
					'<div class="BuyAmount"><%= buyList.at(i).get("amount") %>份</div>',
					'<div class="BuyPrice"><%= buyList.at(i).get("singlePrice") * buyList.at(i).get("amount") %>元</div>',
				'</div>',
				'<div id="updateItem" class="icon" index="<%= i %>" style="-webkit-mask-box-image:url('+ImageResource["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_151_edit"]+');"></div>',
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

			new TouchWidget({el:$('#back-link-wrap', this.el)});
			new TouchWidget({el:$('#buy-link-wrap', this.el)});

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
		_getShoppingCar: function(storeNameId){
			if(!window.shoppingCartCollection) window.shoppingCartCollection = new ShoppingCartCollection();
			var shoppingCarts = window.shoppingCartCollection;
			var shoppingCart = shoppingCarts.get(storeNameId);
			if(!shoppingCart){
				var deliveryLimit = this.model.get('deliveryLimit');
				shoppingCart = new ShoppingCartData({storeNameId:storeNameId, deliveryLimit:deliveryLimit, menu:this.model.get('menuId')});
				shoppingCarts.add(shoppingCart);
			}
			return shoppingCart;
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
			var shoppingCart = this._getShoppingCar(storeNameId);
			
			shoppingCart.clearBuyList();
		},
		checkOut: function(e){
			var storeNameId = this.model.get('storeNameId');
			var shoppingCart = this._getShoppingCar(storeNameId);
			var sum;
			var deliveryLimit = shoppingCart.get('deliveryLimit');
			if(storeNameId.indexOf('85度C')<0){
				sum = shoppingCart.getSum();
			}else{
				sum = shoppingCart.getSum('飲料');
			}
			
			if(sum < deliveryLimit){
				alert('未達外送額度');
				e.preventDefault();
			}
		},
		updateItem: function(e){
			var index = e.currentTarget.getAttribute("index");
			var storeNameId = this.model.get('storeNameId');
			var shoppingCart = this._getShoppingCar(storeNameId);
			var item = shoppingCart.get('buyList').at(index);
			var pid = item.get('productNameId');
			var product = window.menuData.get('stores').get(storeNameId).get('menuId').get('products').get(pid);
			
			var productPanel = window.productPanel;
			productPanel.show('top', {text:'確定', action:function(){
				productPanel.hide('top', function() {
					//update product to shoppingCart
					item.set('selectedOptions', $.extend({},productPanel.selectedOption));
					item.set('singlePrice', productPanel.selectedPrice);
					item.set('amount', productPanel.amount);
					item.set('orderName', productPanel.getOrderName());
					item.set('remarks', productPanel.getRemarks());
					//shoppingCart.updateBuyItem(item);
					shoppingCart.sortBuyList();
					shoppingCart.update();
					shoppingCart.updateDisplay();
					
					window.history.go(-1);
				});
			}}, {text:'取消', action:function(){
				productPanel.hide('top', function() {
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
			var shoppingCart = this._getShoppingCar(storeNameId);
			var item = shoppingCart.get('buyList').at(index);
			
			shoppingCart.removeBuyItem(item);
		},
		resetDisplayedData: function(){
			if(!this.model) return; // not init yet
			var storeNameId = this.model.get('storeNameId');
			var shoppingCart = this._getShoppingCar(storeNameId);
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
	window.myapp.View.ProductPanel,
	window.myapp.Model.ShoppingCart,
	window.myapp.Model.ShoppingCartCollection,
	window.myapp.Widget.TouchWidget);