// Filename: js/views/storeBrief.js
(function(){
	var template = [
		'<a href="#storePage/<%= id %>">',
			'<img src="<%= img %>"></img>',
			'<div class="Tag"></div>',
			'<div class="InfoWidget">',
				'<div class="NameWidget">',
					'<div class="Name"><%= name %></div>',
					'<div class="Msg"><%= msg %></div>',
				'</div>',
				'<div class="Bar"><div></div></div>',
				'<div class="Status"></div>',
			'</div>',
		'</a>'
	].join('');
	
	var StoreBrief = Backbone.View.extend({
		render: function(){
			var id = this.model.get('_storeNameId');
			var name = this.model.get('_displayedName');
			var msg = this.model.get('_msg');
			var img = this.model.get('_imgUrl');
			$(this.el).html(_.template(template, {id:id, name:name, msg:msg, img:img}));
			$(this.el).addClass('StoreBriefWidget3');
			return this;
	    }
	});

	window.myapp = window.myapp || {};
	window.myapp.View = window.myapp.View || {};
	window.myapp.View.StoreBrief = StoreBrief;
})();
