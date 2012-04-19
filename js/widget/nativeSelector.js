// Filename: js/widget/Selector.js
(function(Images, Picker){
	var template = [
		// '<div>',
			'<div class="selectedValue"></div>',
			'<div id="addr-sel-icon">▼</div>',
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
				var selectedValue = [];
				for(var i in that._selectedKey){
					title = that._selectedKey[i];
					selectedValue.add = title+"="+that._selectedKey[title];
				}
				var callback = function(value){
					var newValue = {};
					var data = value.split("&");
					for(var i=0,length=data.length; i<length; i++){
						var s = data[i];
						var ss = s.split("=");
						if(ss.length<2) newValue[ss[0]] = "";
						else newValue[ss[0]] = ss[1];
					}
					that.$el.trigger("selectionChange", newValue);
				};
				//TODO iPad version
				Picker.showPicker(that._isDependent, that._pickerOptionString, selectedValue, callback);
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
					this._selectedKey[title] = op.key[0];
				}
			}
			if(this._isDependent){
				var dcv = this._options[this._parentTitle+":"+this._childTitle+":"+this._selectedKey[this._parentTitle]];
				if(dcv) this._selectedKey[this._childTitle] = Object.keys(dcv)[0];
				else this._selectedKey[this._childTitle] = "";
			}
			this.updateDisplay();
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
		setWordsInLine: function(wordsInLine){
			this._wordsInLine = wordsInLine; 
			this.updateDisplay();
		},
		render: function(){
			return this;
		}
	});
	
	window.myapp = window.myapp || {};
	window.myapp.Widget = window.myapp.Widget || {};
	window.myapp.Widget.NativeSelector = NativeSelector;
})(	window.myapp.Images,
	window.myapp.PG.Picker);
