// Filename: js/pages/startPage.js
(function(i18n, ImageResource, TouchWidget, TabViews){
	var pageTemplate = [
		'<div class="PageLeftPanel" style="display:block; position:absolute; width:200px; -webkit-transition-property:-webkit-transform; -webkit-transition-duration:300ms; -webkit-transform:translate3d(-100%, 0px, 0px);">',
			'<div class="TabButton" href="orderTab"><div class="imgWrap"><img class="icon" src="./css/bootstrap/img/glyphicons_free/glyphicons/png/glyphicons_039_notes.png"></div>'+i18n._('orderTab')+'</div>',
			'<div class="TabButton" href="historyTab"><div class="imgWrap"><img class="icon" src="./css/bootstrap/img/glyphicons_free/glyphicons/png/glyphicons_039_notes.png"></div>'+i18n._('historyTab')+'</div>',
			'<div class="TabButton" href="feedbackTab"><div class="imgWrap"><img class="icon" src="./css/bootstrap/img/glyphicons_free/glyphicons/png/glyphicons_039_notes.png"></div>'+i18n._('feedbackTab')+'</div>',
			'<div class="TabButton" href="aboutUsTab"><div class="imgWrap"><img class="icon" src="./css/bootstrap/img/glyphicons_free/glyphicons/png/glyphicons_039_notes.png"></div>'+i18n._('aboutUsTab')+'</div>',
		'</div>',
		'<div class="PageMainPanel" style="width:100%; height:100%; display:-webkit-box; -webkit-box-orient:vertical; -webkit-transition-property:-webkit-transform; -webkit-transition-duration:300ms;">',
			'<div class="header">',
				// '<div class="top"></div>',
				'<div class="center">',
					'<div class="BackButton"><a><div class="Pointer"></div><div class="Button"><div class="ButtonMsg"></div></div></a></div>',
					'<div class="function-panel">',
						'<a href="#startPage/orderTab"><div class="order-link-wrap"><div class="order-link" class="icon"></div></div></a>',
						'<a href="#startPage/historyTab"><div class="history-link-wrap"><div class="history-link" class="icon"></div></div></a>',
						'<a href="#startPage/feedbackTab"><div class="feedback-link-wrap"><div class="feedback-link" class="icon"></div></div></a>',
						'<a href="#startPage/aboutUsTab"><div class="about-link-wrap"><div class="about-link" class="icon"></div></div></a>',
					'</div>',
					'<div class="NextButton"><div class="Pointer"></div><div class="Button"><div class="ButtonMsg"></div></div></div>',
				'</div>',
				// '<div class="bottom"></div>',
			'</div>',
			'<div class="PageContent" style="width:100%; -webkit-box-flex:10; display:-webkit-box;">',
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
			new TouchWidget({el:$('.BackButton', this.el)});
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
