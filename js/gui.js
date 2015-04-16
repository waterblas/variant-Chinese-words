global.$ = $;
var sbar = require('search_box');
var path = require('path');
var shell = require('nw.gui').Shell;
$().ready(function(){
	var oneDOMon = function(elementName, eventFunc){
		var eventName = "mousedown";
		var _con = $(elementName);
		return {
			setEvent: function(newName) {
				eventName = newName;
			},
			oneBind: function(){
				$(elementName).one(eventName, _con, function(e){
					   // 设置目标区域
					if(!_con.is(e.target)){
						eventFunc(); 
					}
				})
			}
		}
	}
	var alertStatus = {
		checkInput: function(msg){
			$(".alert-warning").show();
			$(".alert-warning span").text(msg);
			oneDOMon(document, function(){ 
				$(".alert-warning").hide();
			}).oneBind();
		},
		mustChose: function(){
			$(".alert-warning").show();
			$(".alert-warning span").text("You have to chose one checkbox at least");
			oneDOMon(document, function(){ 
				$(".alert-warning").hide();
			}).oneBind();
		}

	};
	$("input[name = 'checkbox']").on("change", function(){
		var noChoice = true;
		$("input[name = 'checkbox']").each(function(){
			if($(this).prop('checked') == true){
				noChoice = false;
			}
		});
		if(noChoice == true){
			$("input[name = 'checkbox']").prop('checked', true);
			alertStatus.mustChose();
		}
	});

	var hanziDb = new sbar.SearchBox($('#searchBtn'));
	hanziDb.on('navigate', function(info){
		console.log(info);
		if(info && info.msg == "blank"){
			alertStatus.checkInput("Better check yourself. Can't access blank input");
		}else if(info && info.msg == "more"){
			alertStatus.checkInput("six charaters at most");
		}else if(info && info.status){
			if($(".floatInputDom").data("modal") === false){
				$(".floatInputDom").css("margin-top", "5%").data("modal", true);
			}
			hanziDb.extract();
		}else{
			window.alert("system error");
		}
	});
	hanziDb.on('dataStatus', function(status){
		if(status.tongyin && status.xingjin && status.chaifen){
			var formatDate = hanziDb.formatDate();
		}	
	});
})