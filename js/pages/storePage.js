//Filename: js/pages/storePage.js
(function(ImageResource, TouchWidget, Scroller){
	var pageTemplate = [
		'<div class="HeaderPanel">',
			'<div><div class="HeaderButton BackButton"><span class="Pointer"></span><span class="Button">返回</span></div></div>',
			'<div id="storeName">',
			'</div>',
			'<div></div>',
		'</div>',
		'<div id="storeContent" style="-webkit-box-flex: 10;display: -webkit-box;-webkit-box-orient: vertical;-webkit-box-pack: justify;">',
		'</div>',
		'<div class="ShoppingCar">',
			'<div style="position: relative; " class="Car">',
				'<div style="position: absolute; overflow-x: hidden; overflow-y: hidden; top: 0%; right: 0%; bottom: 0%; width: 25%; ">',
					'<div class="Button" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px; ">',
						'<div><img src="'+ImageResource.ShoppingCarIcon+'"></div><div class="ButtonText">查看</div>',
					'</div>',
				'</div>',
				'<div style="position: absolute; overflow-x: hidden; overflow-y: hidden; left: 0%; top: 0%; right: 25%; height: 50%; ">',
					'<div class="ProgressBarPanel" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px; ">',
						'<div class="ProgressMsgOk">可外送</div><div style="" class="ProgressMsgNotOk">未達額度</div>',
						'<div class="ProgressBar"><div class="Progress"></div></div>',
						'<div class="gwt-Label">0/800</div>',
					'</div>',
				'</div>',
				'<div style="position: absolute; overflow-x: hidden; overflow-y: hidden; left: 0%; top: 50%; bottom: 0%; width: 30%; ">',
					'<div class="gwt-Label" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px; ">總共$</div>',
				'</div>',
				'<div style="position: absolute; overflow-x: hidden; overflow-y: hidden; left: 30%; top: 50%; right: 25%; bottom: 0%; ">',
					'<div class="gwt-Label" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px; ">0元</div>',
				'</div>',
			'</div>',
		'</div>'
	].join('');
	
	var productWidgetTemplate = [
		'<div class="ProductBoxWidget2">',
			'<img class="ProductBoxWidget2-img" src="<%= img %>"/>',
			'<div class="ProductBoxWidget2-info">',
				'<div class="ProductBoxWidget2-name"><%= name %></div>',
				'<div class="ProductBoxWidget2-price"><%= price %></div>',
			'</div>',
		'</div>'
	].join('');
	var productWidgetTemplate_noImg = [
		'<div class="ProductBoxWidget2">',
			'<div class="ProductBoxWidget2-infoNoImg">',
				'<div class="ProductBoxWidget2-name"><%= name %></div>',
				'<div class="ProductBoxWidget2-price"><%= price %></div>',
			'</div>',
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
			$(this.el).html(_.template(pageTemplate));
			$("#storeContent", this.el).html(this.scroller.render().el);
			this.backBtn = new TouchWidget({ el: $('.BackButton', this.el) });
			this.backBtn.changeColorWhenTouch = true;
		},
  		setModel: function(model){
  			this.model = model;
  			var that = this;
  			//  title
			var storeName = this.model.get('_displayedName');
			$("#storeName", this.el).html(storeName);
			// product items
			this.scroller.getContent().empty();
			var products = this.model.get('_menuId').get('products').models;
			_.each(products, function(p){
				var el = document.createElement('div');
				el.style['float'] = 'left';
				var img = p.get('_imgUrl');
				var pname = p.get('_displayedName');
				var pprice = p.get('_price');
				if(img){
					el.style.width = '142px';
					el.style.height = '218px';
					$(el).html(_.template(productWidgetTemplate,{img:img, name:pname, price:pprice}));
				}else{
					el.style.width = '142px';
					el.style.height = '106px';
					$(el).html(_.template(productWidgetTemplate_noImg,{name:pname, price:pprice}));
				}
				that.scroller.getContent().append(el);
			});
  		},
		render: function(){
			// shopping car
			// re-bind event
			this.backBtn.delegateEvents();
			this.scroller.render();
			return this;
	  	}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.StorePageView = StorePageView;
})(	window.myapp.Images,
	window.myapp.Widget.TouchWidget, 
	window.myapp.Widget.Scroller);