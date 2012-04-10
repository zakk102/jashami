//Filename: js/models/shoppingCartData.js
(function(){
	var ShoppingCartData = Backbone.Model.extend({
		defaults:{
			deliveryLimit: 0,
			sum: 0,
			products: []
		},
		initialize: function(){
			this.bind("change:products", function(){
				var products = this.get('products');
				var sum = 0;
				
				for(var i=0; i<products.length; i++){
					sum += (products[i].product.get('price') * products[i].amount);
				}
				this.set('sum', sum);
				
				window.shoppingCartPanel.resetDisplayedData(this);
			});
			window.shoppingCartPanel.resetDisplayedData(this);
		},
		addProduct: function(product, options){
			this.get('products').push(product);
			if(!options || !options.slient) this.trigger('change:products');
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Model= window.myapp.Model || {};
	window.myapp.Model.ShoppingCartData = ShoppingCartData;
})();
