// Filename: js/views/storeBrief.js
(function(){
	var template = [
			'<img src="<%= img %>"></img>',
			'<div class="Tag"></div>',
			'<div class="InfoWidget">',
				'<div class="NameWidget">',
					'<div class="Name"><%= name %></div>',
					'<div class="Msg"><%= msg %></div>',
				'</div>',
				'<div class="Bar"><div></div></div>',
				'<div class="Status"></div>',
			'</div>'
	].join('');
	
	var StoreBrief = Backbone.View.extend({
		render: function(){
			var name = this.model.get('displayedName');
			var msg = this.model.get('msg');
			var img = this.model.get('imgUrl');
			$(this.el).html(_.template(template, {name:name, msg:msg, img:img}));
			$(this.el).addClass('StoreBriefWidget3');
			return this;
	    }
	});

	window.myapp = window.myapp || {};
	window.myapp.View = window.myapp.View || {};
	window.myapp.View.StoreBrief = StoreBrief;
})();
