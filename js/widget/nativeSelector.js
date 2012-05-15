// Filename: js/widget/nativeSelector.js
(function(Utils, DeviceType, Images, Picker){
	var template = [
		// '<div>',
			'<span class="selectedValue"></span>',
			'<span class="option-sel-icon" style="-webkit-mask-box-image:url('+Images["css/bootstrap/img/glyphicons_free/glyphicons/png-square/glyphicons_220_play_button"]+');"></span>',
		// '</div>',
	].join('');
	
	var NativeSelector = Backbone.View.extend({
		initialize: function(){
			this._wordsInLine = 8;
			this._saperateText = "";
			this._isDependent = false;
			var that = this;
			this.$el.addClass("SelectInput");
			this.$el.html(_.template(template));
			this.$el.on("click", function(){
				console.log("ddddd");
				var selectedValue = [];
				for(var title in that._selectedKey){
					selectedValue.push(title+"="+that._selectedKey[title]);
				}
				var callback = function(value){
					selectedValue = [];
					var data = value.split("&");
					for(var i=0,length=data.length; i<length; i++){
						var s = data[i];
						var ss = s.split("=");
						if(ss.length<2) that._selectedKey[ss[0]] = "";
						else that._selectedKey[ss[0]] = ss[1];
						selectedValue.push(ss[0]+"="+that._selectedKey[ss[0]]);
					}
					that.updateDisplay();
					that.$el.trigger("selectionChange", that.getSelectedValues());
				};
				if(DeviceType.getDeviceType()==DeviceType.iPad){// iPad version
					var ele = that.el;
					var x = Utils.getAbsoluteLeft(ele);
					var y = Utils.getAbsoluteTop(ele);
					var width = ele.clientWidth;
					var height = ele.clientHeight;
					/*console.log("si x = "+x);
					console.log("si y = "+y);
					console.log("si width = "+width);
					console.log("si height = "+height);*/
					var rect = [x, y, width, height];
					Picker.showPicker(that._isDependent, that._pickerOptionString, selectedValue, callback, rect);
				}else{
					Picker.showPicker(that._isDependent, that._pickerOptionString, selectedValue, callback);
				}
			});
		},
		/*
		 * isDependent: boolean
		 * options: {title:{key:val, key:val}, title:{key:val, key:val}}
		 * saperateText: (dependent case only) use this text to saperate the displayed text
		 */
		setModel: function(options, isDependent, saperateText){
			this._isDependent = isDependent;
			this._saperateText = saperateText || "";
			this._options = options; //{title:{key:value}}
			this._selectedKey = {}; //{title:key}
			this._pickerOptionString = [];
			this._parentTitle = "";
			this._childTitle = "";
			
			for(var title in this._options){
				var op = this._options[title];
				var OptionString = title+"?";
				for(var key in op){
					OptionString += key + "&";
				}
				OptionString = OptionString.substring(0, OptionString.length-1);
				this._pickerOptionString.push(OptionString);
			
				if(this._isDependent){
					if(title.indexOf(":")>0){
						var temp = title.split(":");
						this._selectedKey[temp[1]] = "";
						this._childTitle = temp[1]; 
					}else{
						this._selectedKey[title] = Object.keys(op)[0];
						this._parentTitle = title;
					}
				}else{
					this._selectedKey[title] = Object.keys(op)[0];
				}
			}
			if(this._isDependent){
				var dcv = this._options[this._parentTitle+":"+this._childTitle+":"+this._selectedKey[this._parentTitle]];
				if(dcv) this._selectedKey[this._childTitle] = Object.keys(dcv)[0];
				else this._selectedKey[this._childTitle] = "";
			}
			this.updateDisplay();
		},
		clear: function(){
			this._options = {}; //{title:{key:value}}
			this._selectedKey = {}; //{title:key}
			this._pickerOptionString = [];
			this._parentTitle = "";
			this._childTitle = "";
		},
		updateDisplay: function(){
			var displayedString = "";
			for(var title in this._selectedKey){
				var value = this._selectedKey[title];
				if(!value || value.length<1) continue;
				displayedString += value+this._saperateText;
			}
			displayedString = displayedString.substring(0, displayedString.length-this._saperateText.length);
			if(displayedString.length>this._wordsInLine){
				displayedString=displayedString.replace(new RegExp(this._saperateText,"gm"), this._saperateText+"<br/>");
			}
			this.setDisplayText(displayedString);
		},
		setDisplayText: function(text){
			$(".selectedValue", this.el).html(text);
		},
		setSelectedValues: function(values, options){
			for(var title in values){
				var value = values[title];
				var op;
				if(this._isDependent && title==this._childTitle){
					var tkey = this._parentTitle;
					var tkeyvalue = this._selectedKey[tkey];
					tkey += ":" + this._childTitle + ":" + tkeyvalue;
					op = this._options[tkey];
				}else{
					op = this._options[title];
				}
				for(var key in op){
					if(op[key]==value){
						this._selectedKey[title] = key;
						break;
					}
				}
			}
			this.updateDisplay();
			if(!options || !options.silent) this.$el.trigger("selectionChange", this.getSelectedValues());
		},
		getSelectedValues: function(){
			var result = {};
			for(var title in this._selectedKey){
				if(this._isDependent && title==this._childTitle){
					var tkey = this._parentTitle;
					var tkeyvalue = this._selectedKey[tkey];
					tkey += ":" + this._childTitle + ":" + tkeyvalue;
					result[title] = this._options[tkey][this._selectedKey[title]];
				}else{
					result[title] = this._options[title][this._selectedKey[title]];
				}
			}
			return result;
		},
		setWordsInLine: function(wordsInLine){
			this._wordsInLine = wordsInLine; 
			this.updateDisplay();
		},
		showSelector: function(){
			var that = this;
			var selectedValue = [];
			for(var title in that._selectedKey){
				selectedValue.push(title+"="+that._selectedKey[title]);
			}
			var callback = function(value){
				selectedValue = [];
				var data = value.split("&");
				for(var i=0,length=data.length; i<length; i++){
					var s = data[i];
					var ss = s.split("=");
					if(ss.length<2) that._selectedKey[ss[0]] = "";
					else that._selectedKey[ss[0]] = ss[1];
					selectedValue.push(ss[0]+"="+that._selectedKey[ss[0]]);
				}
				that.updateDisplay();
				that.$el.trigger("selectionChange", that.getSelectedValues());
			};
			if(DeviceType.getDeviceType()==DeviceType.iPad){// iPad version
				var ele = that.el;
				var x = Utils.getAbsoluteLeft(ele);
				var y = Utils.getAbsoluteTop(ele);
				var width = ele.clientWidth;
				var height = ele.clientHeight;
				/*console.log("si x = "+x);
				console.log("si y = "+y);
				console.log("si width = "+width);
				console.log("si height = "+height);*/
				var rect = [x, y, width, height];
				Picker.showPicker(that._isDependent, that._pickerOptionString, selectedValue, callback, rect);
			}else{
				Picker.showPicker(that._isDependent, that._pickerOptionString, selectedValue, callback);
			}
  		},
		render: function(){
			return this;
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Widget = window.myapp.Widget || {};
	window.myapp.Widget.NativeSelector = NativeSelector;
})(	window.myapp.Utils,
	window.myapp.Utils.DeviceType,
	window.myapp.Images,
	window.myapp.PG.Picker);
