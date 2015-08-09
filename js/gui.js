global.$ = $;
var sbar = require('search_box');
var tstream = require('text_stream');
var tBox = require('textbox_view');
var gui = require('nw.gui');

var VCW = {
	'hanziDb': new sbar.SearchBox($('#searchBtn')),
	'textStream': new tstream.TextStream($('#exampleInputFile')),
	'textView': new tBox.TextBox($('.table')),
	'menu': new Menu()
};

VCW.alert = function(){
	var oneDOMon = function(elementName, eventFunc){
		var _con = $(elementName);
		$(elementName).one("mousedown", _con, function(e){
			// 设置目标区域
			if(!_con.is(e.target)){
				eventFunc();
			}
		})
	};
	return{
		checkInput: function(msg){
			$(".alert-warning").show();
			$(".alert-warning span").text(msg);
			oneDOMon(document, function(){
				$(".alert-warning").hide();
			});
		},
		mustChose: function(){
			$(".alert-warning").show();
			$(".alert-warning span").text("You have to chose one checkbox at least");
			oneDOMon(document, function(){
				$(".alert-warning").hide();
			});
		}
	};
};

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
		VCW.menu.canPaste(clipData.length > 0);
		VCW.menu.canCopy(selectionType === 'RANGE');
		VCW.menu.popup(e.originalEvent.x, e.originalEvent.y);
	}
});

//界面事件
$("input[name = 'checkbox']").on("change", function(){
	var thisDom = $(this);
	var noChoice = true;
	$(thisDom).each(function(){
		if($(this).prop('checked') == true){
			noChoice = false;
		}
	});
	if(noChoice == true){
		$(thisDom).prop('checked', true);
		VCW.alert.mustChose();
	}
});

//后台通信
VCW.hanziDb.on('navigate', function(info){
	console.log(info);
	if(info && info.msg == "blank"){
		VCW.alert.checkInput("Better check yourself. Can't access blank input");
	}else if(info && info.msg == "more"){
		VCW.alert.checkInput("six charaters at most");
	}else if(info && info.status){
		var floatDom = $(".floatInputDom");
		if(floatDom.data("modal") === false){
			floatDom.css("margin-top", "5%").data("modal", true);
		}
		VCW.hanziDb.extract();
	}else{
		window.alert("system error");
	}
});
VCW.hanziDb.on('dataStatus', function(status){
	if(status.tongyin && status.xingjin && status.chaifen){
		VCW.hanziDb.formatDate();
	}
});
VCW.hanziDb.on('format', function(res){
	var originInput = hanziDb.hanziOrigin;
	VCW.textStream.findVariant(originInput, res);
	VCW.textView.reset();
	console.log("formatDate", res);
});
VCW.textStream.on('stream', function(path, fileData){
	VCW.textView.show(path, fileData);
});
VCW.textView.on('open', function(filePath){
	gui.Shell.openItem(filePath);
});