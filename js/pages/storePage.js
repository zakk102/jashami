//Filename: js/pages/storePage.js
(function(Scroller){
	var pageTemplate = [
		'<div class="HeaderPanel">',
			'<div></div>',
			'<div>',
				'<%= storeName %>',
			'</div>',
			'<div></div>',
		'</div>',
		'<div id="storeContent" style="-webkit-box-flex: 10;display: -webkit-box;-webkit-box-orient: vertical;-webkit-box-pack: justify;">',
		'</div>'
	].join('');
	
	var StorePageView = Backbone.View.extend({
		initialize: function(){
			$(this.el).addClass('Base');
			$(this.el).attr("style","height:100%");
			$(this.el).attr("style","width:100%");
			this.scroller = new Scroller();
			$(this.scroller.el).css('background-color', 'rgba(255, 255, 255, 0.75)');
			$(this.scroller.el).css('display', '-webkit-box');	
			$(this.scroller.el).css('width', '100%');
			$(this.scroller.el).css('-webkit-box-flex', '1');
		},
		render: function(){
			var storeName = this.model.get('_displayedName');
			$(this.el).html(_.template(pageTemplate,{storeName:storeName}));
			$("#storeContent", this.el).html(this.scroller.render().el);
			return this;
	  	}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.StorePageView = StorePageView;
})(window.myapp.Widget.Scroller);