global.$ = $;
var sbar = require('search_box');
var tstream = require('text_stream');
var tBox = require('textbox_view');
var gui = require('nw.gui');

//阻止文件拖拽进窗口
$(window).on('dragover', function (e) {
    e.preventDefault();
    e.originalEvent.dataTransfer.dropEffect = 'none';
});
$(window).on('drop', function (e) {
    e.preventDefault();
});
//处理某些默认可拖拽的元素
$(document).on('dragstart', 'a', function (e) {
    e.preventDefault();
});

//输入框的右键菜单
$(document).on('contextmenu', function (e) {
    e.preventDefault();
    var $target = $(e.target);
    var selectionType = window.getSelection().type.toUpperCase();
    if ($target.is(':text')) {   // TODO url/email/... 未加入判断哦
        var clipData = gui.Clipboard.get().get();
        menu.canPaste(clipData.length > 0);
        menu.canCopy(selectionType === 'RANGE');
        menu.popup(e.originalEvent.x, e.originalEvent.y);
    }
});

var menu = new Menu();
function Menu() {
    this.menu = new gui.Menu();
    this.cut = new gui.MenuItem({
        label: '剪切',
        click: function () {
            document.execCommand('cut');
        }
    });

    this.copy = new gui.MenuItem({
        label: '复制',
        click: function () {
            document.execCommand('copy');
        }
    });

    this.paste = new gui.MenuItem({
        label: '粘贴',
        click: function () {
            document.execCommand('paste');
        }
    });

    this.menu.append(this.cut);
    this.menu.append(this.copy);
    this.menu.append(this.paste);
}

Menu.prototype.canCopy = function (bool) {
    this.cut.enabled = bool;
    this.copy.enabled = bool;
};

Menu.prototype.canPaste = function (bool) {
    this.paste.enabled = bool;
};

Menu.prototype.popup = function (x, y) {
    this.menu.popup(x, y);
};

//界面事件
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
	var textStream = new tstream.TextStream($('#exampleInputFile'));
	var textView = new tBox.TextBox($('.table'));
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
			hanziDb.formatDate();
		}	
	});
	hanziDb.on('format', function(res){
		var originInput = hanziDb.hanziOrigin;
		textStream.findVariant(originInput, res);
		console.log("formatDate", res);
	});
	textStream.on('stream', function(path, fileData){

	})
})