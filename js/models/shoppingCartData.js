//Filename: js/models/shoppingCartData.js
(function(Menu){
	var BuyItem = Backbone.Model.extend({
	});
	
	var BuyList = Backbone.Collection.extend({
		model:BuyItem
	});
	
	var ShoppingCart = Backbone.RelationalModel.extend({
		defaults:{
			deliveryLimit: 0,
			amount: 0,
			sum: 0,
			buyList: new BuyList()
		},
		idAttribute: 'storeNameId',
		relations: [{
			type: Backbone.HasOne,
	        key: 'menu',
	        relatedModel: Menu
	    }],
		initialize: function(){
			var buyList = new BuyList();
			buyList.comparator = this._buyItemComparator;
			this.set('buyList', buyList);
			//this.updateDisplay();
		},
		_buyItemComparator: function(arg0, arg1){
			var orderName0 = arg0.get('orderName');
			var orderName1 = arg1.get('orderName');
			if(orderName0!=orderName1){
				return orderName0.localeCompare(orderName1);
			}
			if(arg0.get('productNameId')==arg1.get('productNameId')){
				if(arg0.get('amount')==arg1.get('amount')){
					var selectedOption0 = arg0.get('selectedOptions');
					var selectedOption1 = arg1.get('selectedOptions');
					for(var key in selectedOption0){
						if(selectedOption0[key]!=selectedOption1[key]){
							return -1;
						}
					}
					return arg0.get('remarks').localeCompare(arg1.get('remarks'));
				}
			}
			return arg0.get('productNameId').localeCompare(arg1.get('productNameId'));
		},
		update: function(){
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
		},
		updateDisplay: function(){
			if(window.shoppingCartPanel && window.shoppingCartPanel.resetDisplayedData) window.shoppingCartPanel.resetDisplayedData(this);
			if(window.orderInfoPage && window.orderInfoPage.resetDisplayedData) window.orderInfoPage.resetDisplayedData();
		},
		addBuyItem: function(buyItem, options){
			this.get('buyList').push(buyItem);
			this.get('buyList').sort();
			this.update();
			if(!options || !options.slient) this.updateDisplay();
		},
		removeBuyItem: function(buyItem, options){
			this.get('buyList').remove(buyItem);
			this.update();
			if(!options || !options.slient) this.updateDisplay();
		},
		updateBuyItem: function(index, buyItem, options){
			//this.get('buyList').remove(buyItem);
			//this.get('buyList').push(buyItem);
			this.get('buyList').models[index] = buyItem;
			this.get('buyList').sort();
			this.update();
			if(!options || !options.slient) this.updateDisplay();
		},
		clearBuyList: function(options){
			this.set('amount', 0);
			this.set('sum', 0);
			this.get('buyList').reset();
			this.update();
			if(!options || !options.slient) this.updateDisplay();
		},
		sortBuyList: function(){
			this.get('buyList').sort();
		},
		getSum: function(category, menu){
			if(!category) return this.get('sum');
			var products = this.get('menu').get('products');
			var buyList = this.get('buyList');
			var sum = 0;
			for(var i=0,length=buyList.length; i<length; i++){
				var bi = buyList.at(i);
				var cate = products.get(bi.get('productNameId')).get('category');
				cate = cate.substring(cate.indexOf('.')+1);
				if(cate==category) sum += (bi.get('singlePrice') * bi.get('amount'));
			}
			return sum;
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
})(	window.myapp.Model.Menu);
