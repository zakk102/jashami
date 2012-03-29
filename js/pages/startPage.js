// Filename: js/pages/startPage.js
(function(i18n, ImageResource, TabViews){
	var pageTemplate = [
		'<div class="PageLeftPanel" style="display:block; position:absolute; width:200px; -webkit-transition-property:-webkit-transform; -webkit-transition-duration:300ms; -webkit-transform:translate3d(-100%, 0px, 0px);">',
			'<li><div class="TabButton" href="orderTab">'+i18n._('orderTab')+'</div></li>',
			'<li><div class="TabButton" href="historyTab">'+i18n._('historyTab')+'</div></li>',
			'<li><div class="TabButton" href="feedbackTab">'+i18n._('feedbackTab')+'</div></li>',
			'<li><div class="TabButton" href="aboutUsTab">'+i18n._('aboutUsTab')+'</div></li>',
		'</div>',
		'<div class="PageMainPanel" style="width:100%; height:100%; display:-webkit-box; -webkit-box-orient:vertical; -webkit-transition-property:-webkit-transform; -webkit-transition-duration:300ms;">',
			'<div class="HeaderPanel">',
				'<div><div class="HeaderButton BackButton"><span class="Pointer"></span><span class="Button">更多</span></div></div>',
				'<div>',
					'<img src="'+ImageResource.JashamiLogo+'">',
				'</div>',
				'<div></div>',
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
		},
		events:{
			"click .PageContent":"hideFunctionPanel",
			"click .BackButton":"toggleFunctionPanel",
			"click .PageLeftPanel div":"toTab2"
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
{	orderTab:window.myapp.OrderTabView, 
	historyTab:window.myapp.HistoryTabView, 
	feedbackTab:window.myapp.FeedbackTabView, 
	aboutUsTab:window.myapp.AboutUsTabView
});