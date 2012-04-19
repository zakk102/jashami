//Filename: js/models/shoppingCartData.js
(function(){
	var BuyItem = Backbone.Model.extend({
	});
	
	var BuyList = Backbone.Collection.extend({
		model:BuyItem
	});
	
	var ShoppingCart = Backbone.Model.extend({
		defaults:{
			deliveryLimit: 0,
			amount: 0,
			sum: 0,
			buyList: new BuyList()
		},
		idAttribute: 'storeNameId',
		initialize: function(){
			this.set('buyList',new BuyList());
			this.updateDisplay();
		},
		updateDisplay: function(){
			var buyList = this.get('buyList');
			var sum = 0;
			var amount = 0;
			
			for(var i=0,length=buyList.length; i<length; i++){
				var bi = buyList.at(i);
				sum += (bi.get('singlePrice') * bi.get('amount'));
				amount += bi.get('amount');
			}
			this.set('amount', amount);
			this.set('sum', sum);
			
			if(window.shoppingCartPanel && window.shoppingCartPanel.resetDisplayedData) window.shoppingCartPanel.resetDisplayedData(this);
			if(window.orderInfoPage && window.orderInfoPage.resetDisplayedData) window.orderInfoPage.resetDisplayedData();
		},
		addBuyItem: function(buyItem, options){
			this.get('buyList').push(buyItem);
			if(!options || !options.slient) this.updateDisplay();
		},
		removeBuyItem: function(buyItem, options){
			this.get('buyList').remove(buyItem);
			if(!options || !options.slient) this.updateDisplay();
		},
		updateBuyItem: function(buyItem, options){
			this.get('buyList').remove(buyItem);
			this.get('buyList').push(buyItem);
			if(!options || !options.slient) this.updateDisplay();
		},
		clearBuyList: function(options){
			this.set('amount', 0);
			this.set('sum', 0);
			this.get('buyList').reset();
			if(!options || !options.slient) this.updateDisplay();
		}
	});
	
	var ShoppingCartCollection = Backbone.Collection.extend({
		model:ShoppingCart
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Model= window.myapp.Model || {};
	window.myapp.Model.BuyItem = BuyItem;
	window.myapp.Model.ShoppingCart = ShoppingCart;
	window.myapp.Model.ShoppingCartCollection = ShoppingCartCollection;
})();
