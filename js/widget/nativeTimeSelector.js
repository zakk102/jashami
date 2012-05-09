// Filename: js/widget/nativeTimeSelector.js
(function(NativeSelector){
	var template = [
		'<div class="SelectInput"></div>'
	].join('');
	
	var NativeTimeSelector = Backbone.View.extend({
		initialize: function(){
			this.$el.addClass("DateTimeSelectionBox");
			this.$el.html(_.template(template));
			var selector = new NativeSelector({el:$(".SelectInput",this.el)});
			selector.setWordsInLine(100);
			this.selector = selector;
		},
		events: {
			'selectionChange *': 'timeChanged'
  		},
  		timeChanged: function(e){
  			this.$el.trigger("dateTimeSelectionChange", this.getSelection());
		},
		setDataList: function(data){
			if(!data || data.length<1){
				this.selector.clear();
				return;
			}
			var dateMap = {}, timeMap = {}, options = {};
			dateMap[ this._getDateText(new Date(data[0])) ] = data[0];
			timeMap[ this._getTimeText(new Date(data[0])) ] = data[0];
			options[ "date" ] = dateMap; 
			options[ "date:time:"+this._getDateText(new Date(data[0])) ] = timeMap;
			for(var i=0, length=data.length-1; i<length; i++){
				var d1 = data[i];
  				var d2 = data[i+1];
  				var D1 = new Date(d1), D2 = new Date(d2);
  				if(D1.getYear()==D2.getYear()&&D1.getMonth==D2.getMonth&&D1.getDate()==D2.getDate()){ // the same date
  					timeMap[i18n.formatDate(D2 ,"H:i")] = d2;
  				}else{
  					timeMap = {};
					timeMap[this._getTimeText(D2)] = d2;
					options["date:time:"+this._getDateText(D2)] = timeMap;
					dateMap[this._getDateText(D2)] = d2;
  				}
			}
			this.selector.setModel(options, true, "");
		},
		getSelection: function(){
  			var value = this.selector.getSelectedValues()["time"];
  			return isNaN(value)? undefined : new Date(value);
  		},
		render: function(){
			return this;
		},
		_getDateText: function(date){
			var today=new Date();
			if(today.getYear()==date.getYear()&&today.getMonth==date.getMonth&&today.getDate()==date.getDate()){
				return "今天";
			}else{
				return i18n.formatDate(date ,"m 月 d 日 (D)");
			}
			
		},
		_getTimeText: function(date){
			return i18n.formatDate(date ,"H:i");
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Widget = window.myapp.Widget || {};
	window.myapp.Widget.NativeTimeSelector = NativeTimeSelector;
})(	window.myapp.Widget.NativeSelector);
