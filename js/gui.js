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
		blankInput: function(){
			$(".alert-warning").show();
			$(".alert-warning span").text("Better check yourself. Can't access blank input");
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
		console.log('checkbox right');
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
	$("#searchBtn").on("click", function(){
		var ChineseWords = $("input[name = 'ChineseWords']").val();
		console.log(ChineseWords.length);
		if(ChineseWords.length <= 0){
			alertStatus.blankInput();
		}else{
			if($(".floatInputDom").data("modal") === false){
				$(".floatInputDom").css("margin-top", "5%").data("modal", true);
			}
		}
	})
})