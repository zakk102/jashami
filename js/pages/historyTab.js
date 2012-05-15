// Filename: js/pages/historyTab.js
(function(Scroller, Accordion, OrderHistory){
	var tabTemplate = [
		'<div class="historyTab">',
			'<div id="pullDown" class="refresh-panel"></div>',
			'<div class="OrderHistory">',
				'<div class="OrderHistoryPanelTitle">',
					'<div class="column-name"></div>',
					'<div class="column-name">送餐時間</div>',
					'<div class="column-name">編號</div>',
					'<div class="column-name">狀態</div>',
				'</div>',
				'<div class="OrderHistoryPanel"></div>',
			'</div>',
			'<div id="pullUp" class="refresh-panel"></div>',
		'</div>'
	].join('');
	
	var orderHeaderTemplate = [
		'<div class="AccordionArrow"></div>',
		'<div><%= want.format("m/d H:i") %></div>',
		'<div><%= send.format("md")+"-"+ID.substring(ID.length-3) %></div>',
		'<div><%= status %></div>'			
	].join('');
	
	var orderContentTemplate = [
	'<div class="content-wrapper">',
		'<div class="TakeOutLabel"><%',
			'if(storePhone){ print(store+"("+storePhone+")"+":"); }',
			'else{ print(store+":"); }',
		'%></div>',
		'<ul class="BuyList">',
		'<%', 
			'for(var i=0, length=buyList.length; i<length; i++){',
				'var bi=buyList[i];',
				'var pname=bi.productNameId, amount=bi.amount, singlePrice=bi.singlePrice, orderName=bi.orderName, option="", orderNameString="";', 
				'pname=pname.split("_")[1];',
				'var opt=bi.selectedOptions, keySet=Object.keys(opt);',
				'if(orderName && orderName.length>0 && orderName!="null"){',
					'orderNameString="<span style=\'background:-webkit-gradient(linear,center top, center bottom, from(#5D311A), color-stop(2%, #F38D48), color-stop(98%,#CE6522), to(white));\'>"+orderName+"</span>";',
				'}',
				'if(keySet.length>0){',
					'option="[";',
					'for(var j=0, length2=keySet.length; j<length2; j++){',
						'var key=keySet[j];', 
						'option+=key+":"+bi.selectedOptions[key]+",";',
					'}',
					'option=option.substring(0,option.length-1); option+="]";',
				'}',
				'if(singlePrice>0){',
					'print("<li>"+orderNameString+pname+option+" X "+amount+" = "+singlePrice*amount+"元</li>");',
				'}else{',
					'print("<li>"+orderNameString+pname+option+" X "+amount+"</li>");',
				'}',
			'}',
		'%>',
		'</ul>',
		'<div class="TotalMoney"><%= "總共"+total+"元" %></div>',
		'<div><%= notes %></div>',
	'</div>'
	].join('');
	
	var orderStatus = {};
	orderStatus.New = "未回覆";
	orderStatus.Accepted = "已確認";
	orderStatus.Rejected = "無法出餐";
	orderStatus.Processing = "連線中";
	orderStatus.Finished = "完成";
	
	var HistoryTabView = Backbone.View.extend({
		initialize: function(){
			var scroller = new Scroller();
			this.scroller = scroller;
			scroller.html(_.template(tabTemplate));
			$(this.el).html(scroller.el);
			// $(this.el).css('background-color', 'rgba(255, 255, 255, 0.75)');
			$(this.el).css('display', '-webkit-box');	
			$(this.el).css('-webkit-box-flex', '10');
			$(scroller.el).css('width', '100%');
			$('.OrderHistoryPanel', this.el).css('minHeight', window.clientHeight);
			
			var accordion = new Accordion({el:$('.OrderHistoryPanel',this.el)});
			
			pullDownEl = $('#pullDown', this.el);
			pullDownOffset = 30;
			pullUpEl = $('#pullUp', this.el);
			pullUpOffset = 30;
			var that = this;
			var pullUpAction = function(){
			};
			var pullDownAction = function(){
				var orderHistory = new OrderHistory();
				orderHistory.setAPI("getOrderHistory",{phoneId:myapp.LocalModel.getUUID()});
				orderHistory.fetch({success:function(){
					window.orderHistory = orderHistory;
					// re-render order widget history list
					accordion.clear();
					_.each(orderHistory.models, function(m, index){
						var note = '';
						var notes = m.get('notes');
						for(var key in notes){
							if(key=='sellerRejectReason') note += '無法出餐原因：'+notes[key]+'<br/>';
							else note += key+'：'+notes[key]+'<br/>';
						}
						var header = _.template(orderHeaderTemplate, {send:new Date(m.get('submitDate')), want:new Date(m.get('wantDate')), ID: m.get('orderID'), status:orderStatus[m.get('status')]});
						var content = _.template(orderContentTemplate, {store:m.get('branchName'), storePhone:m.get('branchPhone'), buyList:m.get('buyList'), total:m.get('totalMoney'), notes:note});
						accordion.add(header, content);
					});
					// re-fresh scroller boundery
					scroller.render();
				},error:function(){
					console.log('get order history failed');
				}});
			};
			scroller.setPullToRefresh({
				pullDownEl: pullDownEl, 
				pullDownAction: pullDownAction,
				pullDownOffset: 0,
				pullUpOffset: 0
			});
			scroller.scrollTo(0,0,0);
		},
		events:{
			"toggle .Accordion": "toggleCallback"
		},
		toggleCallback: function(){
			this.scroller.render();
		},
		render: function(){
			this.delegateEvents();
			this.scroller.render();
			return this;
	    }
	});
	
	window.myapp = window.myapp || {};
	window.myapp.HistoryTabView = HistoryTabView;
})(	window.myapp.Widget.Scroller,
	window.myapp.Widget.Accordion,
	window.myapp.Model.OrderHistory);


/*
				setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
					el = $('.OrderHistoryPanel', that.el);
					for (i=0; i<3; i++) {
						el.append('<li>Generated row</li>');
					}
					scroller.render();		// Remember to refresh when contents are loaded (ie: on ajax completion)
				}, 1000); 
 
 */