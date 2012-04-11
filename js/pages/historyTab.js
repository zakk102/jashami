// Filename: js/pages/historyTab.js
(function(Scroller, Accordion, OrderHistory){
	var tabTemplate = [
		'<div id="pullDown"></div>',
		'<div class="OrderHistory">',
			'<div>',
				'<div class="gwt-Label">點餐紀錄:</div>',
				'<div class="OrderHistoryPanelTitle">',
					'<div class="gwt-Label">✭</div>',
					'<div class="gwt-Label">送餐時間</div>',
					'<div class="gwt-Label">編號</div>',
					'<div class="gwt-Label">狀態</div>',
				'</div>',
			'</div>',
			'<div class="OrderHistoryPanel"></div>',
		'</div>',
		'<div id="pullUp"></div>',
	].join('');
	
	var orderHeaderTemplate = [
		'<div class="AccordionArrow"></div>',
		'<div><%= want.format("m/d H:i") %></div>',
		'<div><%= send.format("md")+"-"+ID.substring(ID.length-3) %></div>',
		'<div><%= status %></div>'			
	].join('');
	
	var orderContentTemplate = [
		'<div class="TakeOutLabel"><%',
			'if(storePhone){ print(store+"("+storePhone+")"+":"); }',
			'else{ print(store+":"); }',
		'%></div>',
		'<ul class="BuyList">',
		'<%', 
			'for(var i=0, length=buyList.length; i<length; i++){',
				'var bi=buyList[i];',
				'var pname=bi.productNameId, amount=bi.amount, singlePrice=bi.singlePrice, orderName=bi.orderName, option="", orderNameString="";', 
				'name=name.split("_")[1];',
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
		'<div class="TotalMoney"><%= "總共"+total+"元" %></div>'
	].join('');
	
	var HistoryTabView = Backbone.View.extend({
		initialize: function(){
			var scroller = new Scroller();
			scroller.html(_.template(tabTemplate));
			$(this.el).html(scroller.el);
			$(this.el).css('background-color', 'rgba(255, 255, 255, 0.75)');
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
				orderHistory.fetch({success:function(){
					window.orderHistory = orderHistory;
					// re-render order widget history list
					accordion.claer();
					_.each(orderHistory.models, function(m, index){
						var header = _.template(orderHeaderTemplate, {send:new Date(m.get('submitDate')), want:new Date(m.get('wantDate')), ID: m.get('orderID'), status:m.get('status')});
						var content = _.template(orderContentTemplate, {store:m.get('branchName'), storePhone:m.get('branchPhone'), buyList:m.get('buyList'), total:m.get('totalMoney')});
						accordion.add(header, content);
					});
					// re-fresh scroller boundery
					scroller.render();
				},error:function(){
					console.log('get order history failed');
				}});
			}
			scroller.setPullToRefresh({
				pullDownEl: pullDownEl, 
				pullDownAction: pullDownAction
			});
			
		},
		render: function(){
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