//Filename: js/pages/storePage.js
(function(ImageResource, Scroller, ProductPanel, ShoppingCartPanel, ShoppingCartData, ShoppingCartCollection, TouchWidget){
	var pageTemplate = [
		'<div class="PageMainPanel">',
			'<div class="header-wrap">',
				'<div class="header-shadow"></div>',
				'<div class="header-outer">',
					'<div class="header">',
						'<div class="center">',
							'<div class="BackButton">',
								'<div class="link-wrap" id="back-link-wrap"><div id="back-link" class="icon" style="-webkit-mask-box-image:url('+ImageResource["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_216_circle_arrow_left"]+');"></div><div class="function-txt">返回</div></div>',					
							'</div>',
							'<div id="title" class="function-panel">',
							'</div>',
							'<div class="NextButton">',
								'<a id="order-info" class="link" href="#startPage/feedbackTab"><div class="link-wrap" id="order-info-link-wrap"><div id="order-info-link" class="icon" style="-webkit-mask-box-image:url('+ImageResource["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_202_shopping_cart"]+');"></div><div class="function-txt">購物車</div></div></a>',					
							'</div>',
						'</div>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="PageContent" id="storeContent">',
			'</div>',
			'<div id="segmentPanel-outer"><div id="segmentPanel"></div></div>',
			'<div id="order-info-sticker1"></div>',
			'<div id="order-info-sticker1-shadow"></div>',
			'<div class="ShoppingCar">',
				// '<div style="position: relative; " class="Car">',
					'<a id="order-info" class="link" href="#startPage/feedbackTab">',
					'<div class="ShoppingCartPanel"></div>',
					'</a>',
				// '</div>',
			'</div>',
		'</div>'

		// '<div class="header">',
			// '<div><div class="HeaderButton BackButton"><span class="Pointer"></span><span class="Button">返回</span></div></div>',
			// '<div id="title"></div>',
			// '<div></div>',
		// '</div>',
		// '<div id="storeContent" style="">',
// //			'<div id="productPanel" style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-box-pack: justify;"></div>',
// //			'<div id="" style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-box-pack: justify;"></div>',
		// '</div>',
	].join('');
	
	var productWidgetTemplate = [
		'<div class="ProductBoxWidget2 ProductBoxWidget2-image">',
			'<img class="ProductBoxWidget2-img" src="<%= img %>"/>',
			'<div class="ProductBoxWidget2-info">',
				'<div class="ProductBoxWidget2-name"><%= name %></div>',
				'<div class="ProductBoxWidget2-price"><%= price %></div>',
			'</div>',
		'</div>'
	].join('');
	var productWidgetTemplate_noImg = [
		'<div class="ProductBoxWidget2 ProductBoxWidget2-text">',
			'<div class="ProductBoxWidget2-infoNoImg">',
				'<div class="ProductBoxWidget2-name"><%= name %></div>',
				'<div class="ProductBoxWidget2-price"><%= price %></div>',
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
			$(this.scroller.content).addClass('scroller-content');
//			$(this.scroller.el).css('width', '100%');
//			$(this.scroller.el).css('-webkit-box-flex', '1');

			// segment widget
			this._segmentPanelWidth = $(window).width()>640?60:30;
//			this.segmentPanel = new Scroller();
			
			// product panel
			if(!window.productPanel){
				window.productPanel = new ProductPanel();
				$('body').append(window.productPanel.$el);
			}

			// this page
			$(this.el).html(_.template(pageTemplate));
			$("#segmentPanel", this.el).addClass('ScrollBar Segment');
			$("#storeContent", this.el).append(this.scroller.render().el);
//			$("#storeContent", this.el).append(this.segmentPanel.render().el);
//			$(this.segmentPanel.getContent()).addClass('ScrollBar Segment');
	
			// shopping cart panel
			if(!window.shoppingCartPanel){
				window.shoppingCartPanel = new ShoppingCartPanel();
				$('.ShoppingCartPanel', this.el).html(window.shoppingCartPanel.render().el);
			}
			
			// grid setting
			this._col = 2;
			this._gridWidth = 100;
			this._gridHeight = 25;
			this._gridHMargin = 8;
			this._gridVMargin = 6;
			this._minCol = 2;
			this._minGridWidth = $(window).width()<=640?150:200;
			this._maxGridWidth = $(window).width()<=640?200:250;
			
			$(window).bind('resize', function(){
				that._minGridWidth = $(window).width()<=640?150:200;
				that._maxGridWidth = $(window).width()<=640?200:250;
				that._segmentPanelWidth = 0;//$(window).width()>640?60:30;
				var widgetWidth = $(window).width()-that._segmentPanelWidth;
				that.calAndSetGridSize(that._segmentPanelWidth, widgetWidth);
			});
			
			new TouchWidget({el:$('#back-link-wrap', this.el)});
			new TouchWidget({el:$('#order-info-link-wrap', this.el)});
			
		},
		refreshGridSize: function(){
			this._minGridWidth = $(window).width()<=640?150:200;
			this._maxGridWidth = $(window).width()<=640?200:250;
			this._segmentPanelWidth = 0;//$(window).width()>640?60:30;
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
					//grid.css('height', that._gridHeight*2+that._gridVMargin);
					grid.css('height', that._gridHeight*3+that._gridVMargin);
				}else{
					//grid.css('height', that._gridHeight);
					grid.css('height', that._gridHeight);
				}
			}
			$('.SegmentWidget', that.el).width(segmentWidth);
		},
		resetScroller: function(){
			this.scroller.scrollTo(0, 0, 0);
//			this.segmentPanel.scrollTo(0, 0);
		},
		resetDisplayedData: function(){
			this.scroller.getContent().empty();
//			this.segmentPanel.getContent().empty();
			$("#segmentPanel", this.el).empty();
		},
  		setModel: function(model){
  			if(window.loadingPanel) window.loadingPanel.connectionOut();
  			if(model) this.model = model;
  			var that = this;
  			//  title
			var storeName = this.model.get('displayedName');
			$("#title", this.el).html(storeName);
			// product items
			var products = this.model.get('menuId').get('products').models;
			this.model.get('menuId').get('products').sort();
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
					//el.style.height = that._gridHeight*2+that._gridVMargin +'px';
					el.style.height = that._gridHeight*3+that._gridVMargin*2 +'px';
					$(el).html(_.template(productWidgetTemplate,{img:img, name:pname, price:pprice}));
				}else{
					el.style.width = that._gridWidth +'px';
					el.style.height = that._gridHeight +'px';
					$(el).html(_.template(productWidgetTemplate_noImg,{name:pname, price:pprice}));
				}
				$('.ProductBoxWidget2-name', el).text().length>7?$('.ProductBoxWidget2-name', el).addClass('long-name'):$('.ProductBoxWidget2-name', el).removeClass('long-name');
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
					cateWidget.className = 'FlexGridContainer color'+count;
					// for segment localization
					cateWidget.id = 'cateName'+count;
					//cateWidget.style.paddingTop = '15px';
					//cateWidget.style.marginBottom = '-15px';
					$(cateWidget).append(cateNameWidget);
					$(cateWidget).append(el);
					that.scroller.getContent().append(cateWidget);
					// segment widget
					var segment = document.createElement('div');
					segment.className = 'SegmentWidget';
					$(segment).addClass('tag'+count);
					qqq = cateName.indexOf('@')+1;
					if(qqq>0) cate = cateName.substring(qqq);
					var name = document.createElement('div');
					name.className = 'tag-name color'+count;
					name.innerHTML = cate;
					$(segment).append(name);
					// segment.innerHTML = '<div class="tag-name">'+cate+'</div>';
//					that.segmentPanel.getContent().append(segment);
					$("#segmentPanel", that.el).append(segment);
					$(segment).width(that._segmentPanelWidth);
					$(segment).attr('loc', 'cateName'+count);
				}
			};
			
			// render product widgets & bind events
			setTimeout(function(){ // wait time to let browser show above code
				_.each(products, dd);
				//$(cateWidget).css('margin-bottom', '0px'); // reset the margin of last line
				that.scroller.render();
//				that.segmentPanel.render();
				$('.SegmentWidget', that.el).bind('click', function(e){
					var loc = $(e.currentTarget).attr('loc');
	  				that.scroller.scrollToElement($('#'+loc).get(0));
				});
				if(window.loadingPanel) window.loadingPanel.connectionIn();
			},30);			
			// shopping car
			var storeNameId = this.model.get('storeNameId');
			$('#order-info', this.el).attr('href', '#orderInfoPage/'+storeNameId);
			if(!window.shoppingCartCollection) window.shoppingCartCollection = new ShoppingCartCollection();
			var shoppingCarts = window.shoppingCartCollection;
			var shoppingCart = shoppingCarts.get(storeNameId);
			if(!shoppingCart){
				var deliveryLimit = this.model.get('deliveryLimit');
				shoppingCart = new ShoppingCartData({storeNameId:storeNameId, deliveryLimit:deliveryLimit, menu:this.model.get('menuId')});
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
			window.productPanel.show('bottom');
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
	window.myapp.Model.ShoppingCartCollection,
	window.myapp.Widget.TouchWidget);



/*
	"click .NextButton":"checkOut",
		checkOut: function(){
			var storeNameId = this.model.get('storeNameId');
			var shoppingCart = window.shoppingCartCollection.get(storeNameId);
			var sum = shoppingCart.get('sum');
			var deliveryLimit = shoppingCart.get('deliveryLimit');
			
			if(sum >= deliveryLimit){
				location.href = "#userInfoPage/"+this.model.id;
			}else{
				alert('未達外送額度');
			}
		},
 */