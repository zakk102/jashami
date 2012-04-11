// Filename: js/widget/loadingPanel.js
(function(){
	var template = [
		'<div class="Mask" style="z-index: 99998; position: absolute; width: 100%; height: 100%; background: -webkit-gradient(radial, center center, 150, center center, 520, from(rgba(0, 0, 0, 0.6)), to(rgba(0, 0, 0, 0.95)));"></div>',
		'<table class="DialogPanel BusyPanel" style="position: relative; margin-top: auto; margin-right: auto; margin-bottom: auto; margin-left: auto; top: 50%;"><colgroup><col></colgroup><tbody><tr><td><div class="gwt-Label" style="text-align: center; ">請稍等...</div></td></tr><tr><td><div class="BusyPanelAnimation"><div></div><div></div><div></div><div></div><div></div></div></td></tr></tbody></table>',
	].join('');
	
	var LoadingPanel = Backbone.View.extend({
		initialize: function(){
			this.conn = 0;
			$(this.el).attr('id','loadingPanel');
			$(this.el).attr('style','position:absolute; z-index: 99990;width: 100%; height: 100%;');
			$(this.el).hide();
			$(this.el).html(_.template(template));
		},
		connectionOut: function(){
			this.conn++;
			this._update();
		},
		connectionIn: function(){
			this.conn--;
			if(this.conn<0) this.conn = 0;
			this._update();
		},
		_update: function(){
			if(this.conn>0){
				this.$el.show();
			}else{
				this.$el.hide();
			}
		},
		render: function(){
			return this;
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Widget = window.myapp.Widget || {};
	window.myapp.Widget.LoadingPanel = LoadingPanel;
})();
