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
			sum: 0,
			buyList: new BuyList()
		},
		idAttribute: 'storeNameId',
		initialize: function(){
			this.set('buyList',new BuyList());
			this.updateDisplay();
		},
		updateDisplay: function(){
			var products = this.get('buyList');
			var sum = 0;
			
			for(var i=0,length=products.length; i<length; i++){
				sum += (products.at(i).get('product').get('price') * products.at(i).get('amount'));
			}
			this.set('sum', sum);
			
			if(window.shoppingCartPanel && window.shoppingCartPanel.resetDisplayedData) window.shoppingCartPanel.resetDisplayedData(this);
		},
		addBuyItem: function(buyItem, options){
			this.get('buyList').push(buyItem);
			if(!options || !options.slient) this.updateDisplay();
		},
		removeBuyItem: function(options){
			if(!options || !options.slient) this.updateDisplay();
		},
		clearBuyList: function(options){
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
