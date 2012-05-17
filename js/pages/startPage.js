// Filename: js/pages/startPage.js
(function(i18n, ImageResource, TouchWidget, TabViews){
	var pageTemplate = [
		'<div class="PageLeftPanel">',
//			'<div class="TabButton" href="orderTab"><div class="imgWrap"><img class="icon" src="./css/bootstrap/img/glyphicons_free/glyphicons/png/glyphicons_039_notes.png"></div>'+i18n._('orderTab')+'</div>',
//			'<div class="TabButton" href="historyTab"><div class="imgWrap"><img class="icon" src="./css/bootstrap/img/glyphicons_free/glyphicons/png/glyphicons_039_notes.png"></div>'+i18n._('historyTab')+'</div>',
//			'<div class="TabButton" href="feedbackTab"><div class="imgWrap"><img class="icon" src="./css/bootstrap/img/glyphicons_free/glyphicons/png/glyphicons_039_notes.png"></div>'+i18n._('feedbackTab')+'</div>',
//			'<div class="TabButton" href="aboutUsTab"><div class="imgWrap"><img class="icon" src="./css/bootstrap/img/glyphicons_free/glyphicons/png/glyphicons_039_notes.png"></div>'+i18n._('aboutUsTab')+'</div>',
		'</div>',
		'<div class="PageMainPanel">',
			'<div class="header-wrap">',
				'<div class="header-shadow"></div>',
				'<div class="header-outer">',
					'<div class="header">',
						// '<div class="top"></div>',
						'<div class="center" style="background:url('+ImageResource["pic/paper_light_yellow"]+') repeat scroll 0 0;">',
							// '<div class="BackButton"><a><div class="Pointer"></div><div class="Button"><div class="ButtonMsg"></div></div></a></div>',
							'<div class="function-panel">',
								'<a class="link" href="#startPage/orderTab"><div class="link-wrap" id="order-link-wrap"><div id="order-link" class="icon" style=" -webkit-mask-box-image:url('+ImageResource["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_027_search"]+');"></div><div class="function-txt">訂餐</div></div></a>',
					            '<a class="link" href="#startPage/historyTab"><div class="link-wrap" id="history-link-wrap"><div id="history-link" class="icon" style=" -webkit-mask-box-image:url('+ImageResource["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_036_file"]+');"></div><div class="function-txt">紀錄</div></div></a>',
				                '<a class="link" href="#startPage/feedbackTab"><div class="link-wrap" id="feedback-link-wrap"><div id="feedback-link" class="icon" style=" -webkit-mask-box-image:url('+ImageResource["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_309_comments"]+');"></div><div class="function-txt">意見</div></div></a>',
								'<a class="link" href="#startPage/aboutUsTab"><div class="link-wrap" id="about-link-wrap"><div id="about-link" class="icon" style=" -webkit-mask-box-image:url('+ImageResource["css/icons/jashami-logo-toung"]+');"></div><div class="function-txt">關於</div></div></a>',
							'</div>',
							// '<div class="NextButton"><div class="Pointer"></div><div class="Button"><div class="ButtonMsg"></div></div></div>',
						'</div>',
						// '<div class="bottom"></div>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="PageContent">',
			'</div>',
		'</div>'
	].join('');

	var StartPageView = Backbone.View.extend({
		initialize: function(){
			this.isShowFunction = false;
			this.tabs = {};
			this.$el.html(_.template(pageTemplate));
			this.$el.addClass('Base');
			this.$el.attr("id","startPageView");
			this.$el.attr("style","height:100%; width:100%;");
			this.$el.css("-webkit-box-orient", "horizontal");
			new TouchWidget({el:$('#order-link-wrap', this.el)});
			new TouchWidget({el:$('#history-link-wrap', this.el)});
			new TouchWidget({el:$('#feedback-link-wrap', this.el)});
			new TouchWidget({el:$('#about-link-wrap', this.el)});
		},
		events:{
			"click .PageContent":"hideFunctionPanel",
			"click .BackButton":"toggleFunctionPanel",
			"click .PageLeftPanel .TabButton":"toTab2"
		},
		render: function(){
			return this;
	  	},
	  	toggleFunctionPanel: function(e){
	  		if(this.isShowFunction){
	  			this.$el.children('.PageLeftPanel').css('-webkit-transform','translate3d(-100%, 0px, 0px)');
	  			this.$el.children('.PageMainPanel').css('-webkit-transform','translate3d(0px, 0px, 0px)');
	  			this.isShowFunction = false;
	  			this.onToggle = false;
	  		}else{
	  			this.$el.children('.PageLeftPanel').css('-webkit-transform','translate3d(0px, 0px, 0px)');
	  			this.$el.children('.PageMainPanel').css('-webkit-transform','translate3d(200px, 0px, 0px)');
	  			this.isShowFunction = true;
	  		}
	  	},
	  	hideFunctionPanel: function(e){
	  		if(this.isShowFunction){
	  			this.$el.children('.PageLeftPanel').css('-webkit-transform','translate3d(-100%, 0px, 0px)');
	  			this.$el.children('.PageMainPanel').css('-webkit-transform','translate3d(0px, 0px, 0px)');
	  			this.isShowFunction = false;
	  		}
	  	},
	  	toTab: function(tab){
	  		if(!tab) return;
	  		this.currentTab = tab;
	  		if(!this.tabs[tab]){
	  			this.tabs[tab] = new TabViews[tab]();
	  			$('.PageContent', this.el).append(this.tabs[tab].render().el);
	  		}
	  		$('.PageContent', this.el).children().hide();
			$(this.tabs[tab].el).css('display', '-webkit-box');
			this.tabs[tab].render();
			$('.function-panel a', this.$el).removeClass('active');
			$('.function-panel a[href*="'+tab+'"]', this.$el).addClass('active');
	  	},
	  	toTab2: function(e){
	  		var href = $(e.currentTarget).attr('href');
	  		Backbone.history.navigate("#startPage/"+href, {trigger: false, replace: true});
	  		this.toggleFunctionPanel();
	  		this.toTab(href);
	  		this.$el.attr('url',window.location.href);
	  	}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.StartPageView = StartPageView;
})(i18n, window.myapp.Images,
	window.myapp.Widget.TouchWidget,
{	orderTab:window.myapp.OrderTabView, 
	historyTab:window.myapp.HistoryTabView, 
	feedbackTab:window.myapp.FeedbackTabView, 
	aboutUsTab:window.myapp.AboutUsTabView
});