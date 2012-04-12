//Filename: js/models/order.js
(function(Api){
	var Order = Backbone.Model.extend({
		idAttribute: 'orderID'
	});
	
	var OrderHistory = Backbone.Collection.extend({
		model: Order,
		//url: 'http://api.majashami.appspot.com/api/OrderService?action=getOrderHistory&phoneNumber=0933858183',
		url: 'http://api.majashami.appspot.com/api/OrderService?action=getOrderHistory&phoneId=864071458d0d76c9ffcd8542dbdf6be5f57e674f',
		//url: '/jashami/testData/orderHistory',
		setAPI: function(action, args){
			this.url = Api.OrderServiceUrl+"?action="+action+"&";
			if(args && Object.keys(args).length>0){
				for(key in args){
					this.url += key+"="+args[key]+"&";	
				}
			}
			this.url = this.url.substring(0, this.url.length-1);
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Model = window.myapp.Model || {};
	window.myapp.Model.Order = Order;
	window.myapp.Model.OrderHistory = OrderHistory;
})(window.myapp.Api);
