// Filename: js/widget/timeSelector.js
(function(){
	var selectorTemplate = [
//		'<div class="DateTimeSelectionBox">',
			'<select class="date-selector"></select>',
			'<select class="time-selector"></select>',
//		'</div>'
	].join('');
	
	var dateTemplate = [
		'<% for(var i=0,length=data.length; i<length; i++) { %>',
			'<% var date = new Date(data[i]), today=new Date(), text=i18n.formatDate(date, "m 月 d 日 (D)"); %>',
			'<% if(today.getYear()==date.getYear()&&today.getMonth==date.getMonth&&today.getDate()==date.getDate()){text="今天";} %>',
			'<option value="<%= date.getTime() %>"><%= text %></option>',
		'<% } %>'
	].join('');
	
	var timeTemplate = [
		'<% if(data.length>1){ %> <option>請選擇時間</option> <% } %>',
		'<% for(var i=0,length=data.length; i<length; i++) { %>',
			'<% var date = new Date(data[i]); %>',
			'<option value="<%= date.getTime() %>"><%= i18n.formatDate(date ,"H:i") %></option>',
		'<% } %>'
	].join('');
	
	var DateTimeSelector = Backbone.View.extend({
		initialize: function(){
			$(this.el).html(_.template(selectorTemplate));
		},
		events: {
			'change .date-selector': 'dateChanged',
			'change .time-selector': 'timeChanged'
  		},
  		dateChanged: function(e){
  			var value = parseInt($('.date-selector', this.el).val());
  			var timeList = this._sortedTimeList[new Date(value)];
  			$('.time-selector', this.el).html(_.template(timeTemplate, {data:timeList}));
  		},
  		timeChanged: function(e){
  			this.$el.trigger("dateTimeSelectionChange", this.getSelection());
  		},
  		setDataList: function(data){
  			this._sortedTimeList = {};
  			$('.date-selector', this.el).empty();
  			$('.time-selector', this.el).empty();
  			if(data && data.length==1){
  				$('.date-selector', this.el).html(_.template(dateTemplate, {data:data}));
  				$('.time-selector', this.el).html(_.template(timeTemplate, {data:data}));
  			}else if(data && data.length>1){
  				var dateList = [data[0]];
  				var timeList = [data[0]];
  				this._sortedTimeList[new Date(data[0])] = timeList;
  				for(var i=0, length=data.length-1; i<length; i++){
  					var d1 = data[i];
  					var d2 = data[i+1];
  					var D1 = new Date(d1), D2 = new Date(d2);
  					if(D1.getYear()==D2.getYear()&&D1.getMonth==D2.getMonth&&D1.getDate()==D2.getDate()){ // the same date
						timeList.push(d2);
					}else{
						timeList = [];
						timeList.push(d2);
						this._sortedTimeList[D2] = timeList;
						dateList.push(d2);
					}
  				}
  				$('.date-selector', this.el).html(_.template(dateTemplate, {data:dateList}));
  				$('.time-selector', this.el).html(_.template(timeTemplate, {data:this._sortedTimeList[new Date(dateList[0])]}));
  			}
  		},
  		getSelection: function(){
  			var value = parseInt($('.time-selector', this.el).val());
  			return isNaN(value)? undefined : new Date(value);
  		},
  		render: function(){
			return this;
		}
	});
	
	
	window.myapp = window.myapp || {};
	window.myapp.Widget = window.myapp.Widget || {};
	window.myapp.Widget.DateTimeSelector = DateTimeSelector;
})();
