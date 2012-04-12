// Filename: js/widget/accordion.js
(function(){
	var Accordion = Backbone.View.extend({
		initialize: function(){
			$(this.el).addClass('Accordion');
		},
		claer: function(){
			$(this.el).empty();
		},
		add: function(header, content){
			var container = document.createElement('div');
			var h = document.createElement('div');
			var c = document.createElement('div');
			$(h).addClass('AccordionHeader');
			$(c).addClass('AccordionContent');
			$(container).addClass('Collapse');
			$(c).height(0);
			$(h).html(header);
			$(c).html(content);
			$(container).append(h);
			$(container).append(c);
			this.$el.append(container);
		},
		toggleAccordionStack: function(e){
			console.log(e);
			var stack = e.currentTarget.parentNode;
			$(stack).toggleClass('Collapse');
			$(stack).toggleClass('Expand');
			var content = $(stack).children('.AccordionContent');
			console.log(content.offset());
			if($(stack).hasClass('Expand')) content.css('height', 'auto');
			else content.css('height','0px');
		},
		events: {
			"click .AccordionHeader":"toggleAccordionStack"
  		},
		render: function(){
			this.delegateEvents();
			return this;
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Widget = window.myapp.Widget || {};
	window.myapp.Widget.Accordion = Accordion;
})();
