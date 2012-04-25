//Filename: js/views/shoppingCartPanel.js
(function(){
	var pageTemplate = [
		// '<div style="position: absolute; overflow-x: hidden; overflow-y: hidden; left: 0%; top: 0%; right: 25%; height: 50%; ">',
			'<div class="ProgressBarPanel">',
				'<div class="sum">$<%= shoppingCartSum %></div>',				
				'<div class="ProgressBar"><div style="width: <%= progress %>%;" class="Progress"></div></div>',
				// '<div class="gwt-Label" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px; ">總共$</div>',	
				'<% if(shoppingCartSum >= deliveryLimit){ %>',
					'<div class="ProgressMsgOk">可外送</div>',
				'<% }else{ %>',
					'<div style="" class="ProgressMsgNotOk">不滿 <%= deliveryLimit %></div>',
				'<% } %>',
				// '<div class="gwt-Label"><%= shoppingCartSum %>/<%= deliveryLimit %></div>',
			'</div>',
		// '</div>',
		// '<div style="position: absolute; overflow-x: hidden; overflow-y: hidden; left: 0%; top: 50%; bottom: 0%; width: 30%; ">',
		// '</div>',
		// '<div style="position: absolute; overflow-x: hidden; overflow-y: hidden; left: 30%; top: 50%; right: 25%; bottom: 0%; ">',
		// '</div>'
	].join('');
	
	var ShoppingCartPanel = Backbone.View.extend({
		initialize: function(){
			$(this.el).html(_.template(pageTemplate, { 'shoppingCartSum':0, 'deliveryLimit':0, 'progress':0 }));
		},
		render: function(e){
			return this;
		},
		resetDisplayedData: function(model){
			var shoppingCartSum = model.get('sum');
			var deliveryLimit = model.get('deliveryLimit');
			var progress = shoppingCartSum/deliveryLimit*100;

			if(progress >= 100){
				progress = 100;
			}
			$(this.el).html(_.template(pageTemplate, { 'shoppingCartSum':shoppingCartSum, 'deliveryLimit':deliveryLimit, 'progress':progress }));
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.View = window.myapp.View || {};
	window.myapp.View.ShoppingCartPanel = ShoppingCartPanel;
})();
