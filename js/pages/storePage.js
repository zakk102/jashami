//Filename: js/pages/storePage.js
(function(ImageResource, TouchWidget, Scroller){
	var pageTemplate = [
		'<div class="HeaderPanel">',
			'<div><div class="HeaderButton BackButton"><span class="Pointer"></span><span class="Button">返回</span></div></div>',
			'<div id="storeName">',
			'</div>',
			'<div></div>',
		'</div>',
		'<div id="storeContent" style="background-color:rgba(255, 255, 255, 0.75) ; -webkit-box-flex: 10;display: -webkit-box; -webkit-box-orient: horizontal;">',
//			'<div id="productPanel" style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-box-pack: justify;"></div>',
//			'<div id="" style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-box-pack: justify;"></div>',
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
			$(this.el).attr("style","height:100%");
			$(this.el).attr("style","width:100%");
			
			// scroller
			this.scroller = new Scroller();
//			$(this.scroller.el).css('width', '100%');
//			$(this.scroller.el).css('-webkit-box-flex', '1');

			// segment widget
			if($(window).width()>640) this._segmentPanelWidth = 60;
			else this._segmentPanelWidth = 30;
			this.segmentPanel = new Scroller();

			// this page
			$(this.el).html(_.template(pageTemplate));
			$("#storeContent", this.el).append(this.scroller.render().el);
			$("#storeContent", this.el).append(this.segmentPanel.render().el);
			$(this.segmentPanel.getContent()).addClass('ScrollBar Segment');
			this.backBtn = new TouchWidget({ el: $('.BackButton', this.el) });
			this.backBtn.changeColorWhenTouch = true;
			
			// grid setting
			this._col = 3;
			this._gridWidth = 100;
			this._gridHeight = 75;
			this._gridHMargin = 2;
			this._gridVMargin = 3;
			this._minCol = 3;
			this._minGridWidth = 100;
			this._maxGridWidth = 150;
			var refreshGridSize = function(){
				var widgetWidth = $(window).width()-that._segmentPanelWidth;
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
				that.setModel();
			};
			$(this.scroller.el).bind('DOMNodeInsertedIntoDocument', refreshGridSize);
			$(window).bind('resize', refreshGridSize);
		},
  		setModel: function(model){
  			if(model) this.model = model;
  			var that = this;
  			//  title
			var storeName = this.model.get('_displayedName');
			$("#storeName", this.el).html(storeName);
			// product items
			this.scroller.getContent().empty();
			this.segmentPanel.getContent().empty();
			var products = this.model.get('_menuId').get('products').models;
			var cateName;
			var cateWidget;
			_.each(products, function(p){
				var el = document.createElement('div');
				el.style['float'] = 'left';
				el.style.marginTop = that._gridVMargin +'px';
				el.style.marginBottom = that._gridVMargin +'px';
				el.style.marginLeft = that._gridHMargin +'px';
				el.style.marginRight = that._gridHMargin +'px';
				var img = p.get('_imgUrl');
				var pname = p.get('_displayedName');
				var pprice = p.get('_price');
				if(img){
					el.style.width = that._gridWidth +'px';
					el.style.height = that._gridHeight*2+that._gridVMargin +'px';
					$(el).html(_.template(productWidgetTemplate,{img:img, name:pname, price:pprice}));
				}else{
					el.style.width = that._gridWidth +'px';
					el.style.height = that._gridHeight +'px';
					$(el).html(_.template(productWidgetTemplate_noImg,{name:pname, price:pprice}));
				}
				var cate = p.get('_category');
				cate = cate.substring(cate.indexOf('.')+1);
				if(cate==cateName){
					$(cateWidget).append(el);
				}else{
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
					$(segment).attr('loc', cateWidget.offsetTop-$(that.segmentPanel.getContent()).offset().top);
				}
			});
			this.scroller.render();
			this.segmentPanel.render();
			this.scroller.scrollTo(0,0,0);
			this.segmentPanel.scrollTo(0,0,0);
			$('.SegmentWidget', this.el).bind('click', function(e){
				var loc = $(e.currentTarget).attr('loc');
  				that.scroller.scrollTo(0, loc);
			});
  		},
		render: function(){
			// shopping car
			// re-bind event
			this.backBtn.delegateEvents();
			this.scroller.render();
			this.delegateEvents();
			return this;
	  	}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.StorePageView = StorePageView;
})(	window.myapp.Images,
	window.myapp.Widget.TouchWidget, 
	window.myapp.Widget.Scroller);