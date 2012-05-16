// Filename: js/widget/loadingPanel.js
(function(){
	var template = [
		'<div class="Mask"></div>',
		'<div class="loading-icon"></div>',
		'<table class="DialogPanel BusyPanel" style="position: relative; margin-top: auto; margin-right: auto; margin-bottom: auto; margin-left: auto; top: 50%;"><colgroup><col></colgroup><tbody><tr><td><div class="loading-text">請稍等...</div></td></tr><tr><td><div class="BusyPanelAnimation"><div></div><div></div><div></div><div></div><div></div></div></td></tr></tbody></table>',
	].join('');
	
	var LoadingPanel = Backbone.View.extend({
		defaultMsg: '請稍等...',
		initialize: function(){
			this.conn = 0;
			$(this.el).attr('id','loadingPanel');
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
		resetMsg: function(msg){
			if(!msg || msg.length<1){
				$('loading-text', this.el).html(this.defaultMsg);
			}else{
				$('loading-text', this.el).html(msg);
			}
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
