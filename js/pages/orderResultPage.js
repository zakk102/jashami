//Filename: js/pages/orderResultPage.js
(function(Images, Scroller, TouchWidget){
	var pageTemplate = [
		'<div class="header-wrap">',
			'<div class="header-shadow"></div>',
			'<div class="header-outer">',
				'<div class="header">',
					'<div class="center" style="background:url('+ImageResource["pic/paper_warm"]+') repeat scroll 0 0;">',
						'<div class="BackButton" id="cancelBtn">',
							// '<div class="link-wrap"><div id="back-link" class="icon"></div><div class="function-txt">返回</div></div>',									
						'</div>',
						'<div id="title" class="function-panel">',
						'</div>',
						'<div class="NextButton" id="waiterBtn">',
							'<div id="history-link-wrap" class="link-wrap" ><div id="history-link" class="icon" style="-webkit-mask-box-image:url('+Images["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_036_file"]+');"></div><div class="function-txt">看紀錄</div></div>',					
						'</div>',
					'</div>',
				'</div>',
			'</div>',
		'</div>',
		// '<div class="HeaderPanel">',
			// '<div></div>',
			// '<div id="title"></div>',
			// '<div><div class="HeaderButton NextButton"><span class="Button">回首頁</span><span class="Pointer"></span></div></div>',
		// '</div>',
		
		'<div id="orderResult">',
		'</div>'
	].join('');
	
	var orderResultTemplate = [
		'<div class="FinishPanel">',
			'<div class="finish-panel-innner">',
				'<img id="ok-icon" src="'+Images.OKicon+'">',
				'<p id="message">',
				// '<br/>',
				'<span id="text">訂單送到甲蝦米客服了<br/>',
				'會回<span id="about-call-icon" class="icon" style="-webkit-mask-box-image:url('+Images["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_139_phone"]+');"></span>電話或',
				'<span id="about-email-icon" class="icon" style="-webkit-mask-box-image:url('+Images["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_124_message_plus"]+');"></span>簡訊給你\\妳<br/>',
				'請到「紀錄」查詢</span>',
				'</p>',
			'</div>',
		'</div>'
	].join('');
	
	var OrderResultPageView = Backbone.View.extend({
		initialize: function(){			
			$(this.el).addClass('Base');
			$(this.el).attr('id', 'OrderResultPageView');
			
			// scroller
			this.scroller = new Scroller();
			$(this.scroller.el).css('width', '100%');
			// $(this.scroller.el).css('height', '100%');
					
			// this page
			$(this.el).html(_.template(pageTemplate));
			$('#orderResult', this.el).html(this.scroller.render().el);
			this.scroller.html(_.template(orderResultTemplate, { orderNumber:0 }));			

			new TouchWidget({el:$('#history-link-wrap', this.el)});

		},
		events:{
			"click .NextButton":"historyTab"
		},
		historyTab: function(){
			location.href = '#startPage/historyTab';
		},
		homePage: function(){
			// clear shopping car
			if(window.shoppingCartCollection) window.shoppingCartCollection.clear();
			location.href = '#startPage';
		},
		setStore: function(store){
			this.store = store;
		},
		setOrderNumber: function(orderNumber){
			this.orderNumber = orderNumber;
		},
		cleanShoppingCart: function(store){
			window.shoppingCartCollection.get(store).get('buyList').reset();
			window.shoppingCartCollection.get(store).updateDisplay();
		},
		render: function(){
			// re-bind event
			$('#title', this.el).html(this.store);
			this.scroller.html(_.template(orderResultTemplate, { orderNumber:this.orderNumber }));
			this.scroller.render();
			this.delegateEvents();
			return this;
		}
	});
	window.myapp = window.myapp || {};
	window.myapp.OrderResultPageView = OrderResultPageView;
})(	window.myapp.Images,
	window.myapp.Widget.Scroller,
	window.myapp.Widget.TouchWidget);
