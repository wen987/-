
var defineDirect = 'util';//目标对象，所有define模块所返回的对象的属性，都会移植到该目标对象
var define = function(){
	var arg = arguments,
		callback = arg[0],
		callbackArg = [],
		direct = window[defineDirect];
	if(!direct){
		direct = window[defineDirect] = {};
	}
	direct.defineDirect = defineDirect;
	if(arg.length > 1){
		callback = arg[1];
		for(var i = 0, ilen = arg[0].length; i < ilen; i++){
			callbackArg.push(direct);
		}
	}
	$.extend(direct, callback.apply(direct, callbackArg));
};;

define(function () {
	var utilTemplate = {
		fillTemplate: function(t, data){
			var temp = null;
			t = this.fillForEachTem(t, data);
			if(t.indexOf('<null/>') != -1){
				return '';
			}
			return this.fillSimpleTem(t, data);
		},
		fillSimpleTem: function(t, data){
			return t.replace(/\$\{(\w*)\}/g, function(){
				temp = arguments[1];
				if(data.hasOwnProperty(temp)){
					return data[temp];
				}else{
					return '';
				}
			});
		},
		fillForEachTem: function(t, data){
			var _this = this;
			return t.replace(/<foreach from=(\'*\"*)([^'">]*)\1>([\s\S]+)<\/foreach>/, function(){
				var params = arguments[2];
				params = params.split(/\./);
				for(var p in params){
					data = data[params[p]];
				}
				if(!data || !data.length){
					// return arguments[0];
					return '<null/>';
				}
				var sub = arguments[3],
					temp = sub,
					content = '';
				for(var i = 0, len = data.length; i < len; i++){
					temp = _this.fillForTem(sub, data[i]);
					content += _this.fillSimpleTem(temp, data[i]);
				}
				return content;
			});
		},
		fillForTem: function(t, data){
			var _this = this;
			return t.replace(/<for from=(\'*\"*)([^'">]*)\1>([\s\S]+)<\/for>/, function(){
				var params = arguments[2];
				params = params.split(/\./);
				for(var p in params){
					data = data[params[p]];
				}
				if(!data || !data.length){
					return '';
				}
				var sub = arguments[3],
					content = '';
				for(var i = 0, len = data.length; i < len; i++){
					content += _this.fillSimpleTem(sub, {"one": data[i]});
				}
				return content;
			});
		}
	};
	return utilTemplate;
});


var UCtools = (function() {
	return {


		fillTmpl: function(opt) {
			console.log(opt.language)
			var html = util.fillTemplate(opt.tmpl.html(), opt.language);
			opt.insertWrap.html(html);
		},


	}
})();

//获取链接后参数
function Detail() {
	}
	function GetRequest() {
		var url = location.search; //获取url中"?"符后的字串
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for (var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest
	}
	var lan=GetRequest().lan
	if(lan==undefined){
		lan="zh_CN"
	}else if(lan!="zh_CN"&lan!="zh_TW"&lan!="zh_HK"&lan!="en_US"){
		lan="zh_CN"
	}
	Detail.prototype = {
		init: function() {
			UCtools.fillTmpl({
				language: language[lan],
				insertWrap: $('#tpl-wrap'),
				tmpl: $('#tpl-html')
			});

		},

	}
	detail = new Detail();
	detail.init();
