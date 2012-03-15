// Filename: js/pages/startPage
(function(i18n, ImageResource, TabViews){
	var pageTemplate = [
		'<div class="HeaderPanel">',
			'<div></div>',
			'<div>',
				'<img src="'+ImageResource.JashamiLogo+'">',
			'</div>',
			'<div></div>',
		'</div>',
		'<div class="TabPanel">',
			'<div class="TabContent">',
			'</div>',
			'<div class="TabHeader">',
				'<div class="TabButton"><a href="#startPage/orderTab">'+i18n._('orderTab')+'</a></div>',
				'<div class="TabButton"><a href="#startPage/historyTab">'+i18n._('historyTab')+'</a></div>',
				'<div class="TabButton"><a href="#startPage/feedbackTab">'+i18n._('feedbackTab')+'</a></div>',
				'<div class="TabButton"><a href="#startPage/aboutUsTab">'+i18n._('aboutUsTab')+'</a></div>',
			'</div>',
		'</div>'
	].join('');

	var StartPageView = Backbone.View.extend({
		initialize: function(){
			this.tabs = {};
			$(this.el).html(_.template(pageTemplate));
			$(this.el).addClass('Base');
			$(this.el).attr("style","height:100%");
			$(this.el).attr("style","width:100%");
		},
		render: function(){
			return this;
	  	},
	  	toTab: function(tab){
	  		if(!this.tabs[tab]) this.tabs[tab] = new TabViews[tab]();
			$('.TabContent', this.el).html(this.tabs[tab].render().el);
	  	}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.StartPageView = StartPageView;
})(i18n, window.myapp.Images,
	{
	orderTab:window.myapp.OrderTabView, 
	historyTab:window.myapp.HistoryTabView, 
	feedbackTab:window.myapp.FeedbackTabView, 
	aboutUsTab:window.myapp.AboutUsTabView
});