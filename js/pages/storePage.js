//Filename: js/pages/storePage.js
(function(ImageResource, Scroller, ProductPanel, ShoppingCartPanel, ShoppingCartData, ShoppingCartCollection){
	var pageTemplate = [
		'<div class="header">',
			'<div><div class="HeaderButton BackButton"><span class="Pointer"></span><span class="Button">返回</span></div></div>',
			'<div id="title"></div>',
			'<div></div>',
		'</div>',
		'<div id="storeContent" style="-webkit-box-flex: 10;display: -webkit-box; -webkit-box-orient: horizontal;">',
//			'<div id="productPanel" style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-box-pack: justify;"></div>',
//			'<div id="" style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-box-pack: justify;"></div>',
		'</div>',
		'<div class="ShoppingCar">',
			'<div style="position: relative; " class="Car">',
				'<div style="position: absolute; overflow-x: hidden; overflow-y: hidden; top: 0%; right: 0%; bottom: 0%; width: 25%; ">',
					'<a class="Button" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px; ">',
						'<div><img src="'+ImageResource.ShoppingCarIcon+'"></div><div class="ButtonText">查看</div>',
					'</a>',
				'</div>',
				'<div class="ShoppingCartPanel"></div>',
			'</div>',
		'</div>'
	].join('');
	
	var productWidgetTemplate = [
		'<div class="ProductBoxWidget2">',
			'<img class="ProductBoxWidget2-img" src="<%= img %>"/>',
			'<div class="ProductBoxWidget2-info">',
				'<div class="ProductBoxWidget2-name"><%= name %></div>',
				'<div class="ProductBoxWidget2-price"><%= price %>元</div>',
			'</div>',
		'</div>'
	].join('');
	var productWidgetTemplate_noImg = [
		'<div class="ProductBoxWidget2">',
			'<div class="ProductBoxWidget2-infoNoImg">',
				'<div class="ProductBoxWidget2-name"><%= name %></div>',
				'<div class="ProductBoxWidget2-price"><%= price %>元</div>',
			'</div>',
		'</div>'
	].join('');
	
	var StorePageView = Backbone.View.extend({
		initialize: function(){
			var that = this;
			$(this.el).addClass('Base');
			$(this.el).attr("id","storePageView");
			$(this.el).attr("style","height:100%; width:100%;");
			
			// scroller
			this.scroller = new Scroller();
//			$(this.scroller.el).css('width', '100%');
//			$(this.scroller.el).css('-webkit-box-flex', '1');

			// segment widget
			this._segmentPanelWidth = $(window).width()>640?60:30;
			this.segmentPanel = new Scroller();
			
			// product panel
			if(!window.productPanel){
				window.productPanel = new ProductPanel();
				$('body').append(window.productPanel.$el);
			}

			// this page
			$(this.el).html(_.template(pageTemplate));
			$("#storeContent", this.el).append(this.scroller.render().el);
			$("#storeContent", this.el).append(this.segmentPanel.render().el);
			$(this.segmentPanel.getContent()).addClass('ScrollBar Segment');
	
			// shopping cart panel
			if(!window.shoppingCartPanel){
				window.shoppingCartPanel = new ShoppingCartPanel();
				$('.ShoppingCartPanel', this.el).html(window.shoppingCartPanel.render().el);
			}
			
			// grid setting
			this._col = 3;
			this._gridWidth = 100;
			this._gridHeight = 75;
			this._gridHMargin = 2;
			this._gridVMargin = 3;
			this._minCol = 3;
			this._minGridWidth = $(window).width()<=640?100:150;
			this._maxGridWidth = $(window).width()<=640?150:200;
			
			$(window).bind('resize', function(){
				that._minGridWidth = $(window).width()<=640?100:150;
				that._maxGridWidth = $(window).width()<=640?150:200;
				that._segmentPanelWidth = $(window).width()>640?60:30;
				var widgetWidth = $(window).width()-that._segmentPanelWidth;
				that.calAndSetGridSize(that._segmentPanelWidth, widgetWidth);
			});
		},
		refreshGridSize: function(){
			this._minGridWidth = $(window).width()<=640?100:150;
			this._maxGridWidth = $(window).width()<=640?150:200;
			this._segmentPanelWidth = $(window).width()>640?60:30;
			var widgetWidth = $(window).width()-this._segmentPanelWidth;
			this.calAndSetGridSize(this._segmentPanelWidth, widgetWidth);	
		},
		calAndSetGridSize: function(segmentWidth, widgetWidth){
			var that = this;
			$(that.scroller.el).css('width', widgetWidth+'px');
				
			var calGridWidth = widgetWidth/that._col;
			var otherWidth = 2*(that._gridHMargin);
			var newGridWidth = calGridWidth - otherWidth;
	
			while(newGridWidth>that._maxGridWidth){
				that._col++;
				newGridWidth = (widgetWidth/that._col) - otherWidth;
			}
	
			while(that._col>that._minCol && newGridWidth<that._minGridWidth){
				that._col--;
				newGridWidth = (widgetWidth/that._col) - otherWidth;
			}
			
			that._gridHeight = that._gridHeight*newGridWidth/that._gridWidth;
			that._gridWidth = newGridWidth;
			
			// update to every grid
			var grids = $('.Grid', that.el);
			for(i=0; i<grids.length; i++){
				var grid = $(grids.get(i));
				grid.css('width', that._gridWidth);
				if($('img', grid).length){
					grid.css('height', that._gridHeight*2+that._gridVMargin);
				}else{
					grid.css('height', that._gridHeight);
				}
			}
			$('.SegmentWidget', that.el).width(segmentWidth);
		},
		resetScroller: function(){
			this.scroller.scrollTo(0, 0);
			this.segmentPanel.scrollTo(0, 0);
		},
		resetDisplayedData: function(){
			this.scroller.getContent().empty();
			this.segmentPanel.getContent().empty();
		},
  		setModel: function(model){
  			if(model) this.model = model;
  			var that = this;
  			//  title
			var storeName = this.model.get('displayedName');
			$("#title", this.el).html(storeName);
			// product items
			var products = this.model.get('menuId').get('products').models;
			var cateName;
			var cateWidget;
			var count = 0;
			var dd = function(p){
				var el = document.createElement('div');
				el.className = 'Grid';
				el.style['float'] = 'left';
				el.style.marginTop = that._gridVMargin +'px';
				el.style.marginBottom = that._gridVMargin +'px';
				el.style.marginLeft = that._gridHMargin +'px';
				el.style.marginRight = that._gridHMargin +'px';
				var img = p.get('imgUrl');
				var pname = p.get('displayedName');
				var pprice = p.get('price');
				var pid = p.get('productNameId');
				el.pid = pid; 
//$(el).bind('click', function(){window.history.pushState(pid, "page 2", window.location+'/'+pid);});
				if(img){
					el.style.width = that._gridWidth +'px';
					el.style.height = that._gridHeight*2+that._gridVMargin +'px';
					$(el).html(_.template(productWidgetTemplate,{img:img, name:pname, price:pprice}));
				}else{
					el.style.width = that._gridWidth +'px';
					el.style.height = that._gridHeight +'px';
					$(el).html(_.template(productWidgetTemplate_noImg,{name:pname, price:pprice}));
				}
				var cate = p.get('category');
				cate = cate.substring(cate.indexOf('.')+1);
				if(cate==cateName){
					$(cateWidget).append(el);
				}else{
					count++;
					cateName = cate;
					// category title
					var cateNameWidget = document.createElement('div');
					cateNameWidget.className = 'FlexGridContainerTitle';
					var qqq = cateName.indexOf('@');
					if(qqq>=0) cate = cateName.substring(0, qqq);
					cateNameWidget.innerHTML = cate;
					// category widget
					cateWidget = document.createElement('div');
					cateWidget.className = 'FlexGridContainer color1';
					// for segment localization
					cateWidget.id = 'cateName'+count;
					cateWidget.style.paddingTop = '15px';
					cateWidget.style.marginBottom = '-15px';
					$(cateWidget).append(cateNameWidget);
					$(cateWidget).append(el);
					that.scroller.getContent().append(cateWidget);
					// segment widget
					var segment = document.createElement('div');
					segment.className = 'SegmentWidget color1';
					qqq = cateName.indexOf('@')+1;
					if(qqq>0) cate = cateName.substring(qqq);
					segment.innerHTML = '<div>'+cate+'</div>';
					that.segmentPanel.getContent().append(segment);
					$(segment).width(that._segmentPanelWidth);
					$(segment).attr('loc', 'cateName'+count);
				}
			};
			
			// render product widgets & bind events
			setTimeout(function(){ // wait time to let browser show above code
				_.each(products, dd);
				$(cateWidget).css('margin-bottom', '0px'); // reset the margin of last line
				that.scroller.render();
				that.segmentPanel.render();
				$('.SegmentWidget', that.el).bind('click', function(e){
					var loc = $(e.currentTarget).attr('loc');
	  				that.scroller.scrollToElement($('#'+loc).get(0));
				});
			},30);			
			// shopping car
			var storeNameId = this.model.get('storeNameId');
			$('.ShoppingCar a.Button', this.el).attr('href', '#oderInfoPage/'+storeNameId);
			if(!window.shoppingCartCollection) window.shoppingCartCollection = new ShoppingCartCollection();
			var shoppingCarts = window.shoppingCartCollection;
			var shoppingCart = shoppingCarts.get(storeNameId);
			if(!shoppingCart){
				var deliveryLimit = this.model.get('deliveryLimit');
				shoppingCart = new ShoppingCartData({storeNameId:storeNameId, deliveryLimit:deliveryLimit});
				shoppingCarts.add(shoppingCart);
			}
			shoppingCart.updateDisplay();
  		},
  		events:{
			"click .BackButton":"goBack",
			"click .Grid":"showProduct"
		},
		goBack: function(){
			if(window.inTransition) return;
			window.isGoBack = true;
			window.history.back();
		},
		showProduct: function(e){
			// get product id
			pid = $(e.currentTarget).attr('pid');
			// show product panel
			window.productPanel.show('top');
			// set product data
			var menuId = this.model.get('menuId').get('menuId');
			window.productPanel.setModel(this.model.get('menuId').get('products').get(pid), this.model.get('storeNameId'));
			// push state to url
			var href = "";
			if(window.location.hash.indexOf(pid)>=0) href = window.location.hash;
			else href = window.location.hash+'/'+pid;
			Backbone.history.navigate(href, {trigger: false, replace: false});
		},
		render: function(){
			// re-bind event
			this.scroller.render();
			this.delegateEvents();
			return this;
	  	}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.StorePageView = StorePageView;
})(	window.myapp.Images,
	window.myapp.Widget.Scroller,
	window.myapp.View.ProductPanel,
	window.myapp.View.ShoppingCartPanel,
	window.myapp.Model.ShoppingCart,
	window.myapp.Model.ShoppingCartCollection);
