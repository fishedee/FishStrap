define('fishstrap/core/global', function(require, exports, module){

/*
* 依赖jquery.nomod.js
* @require fishstrap/core/jquery
*/
//加入console扩展
$.console = {
	log:function(msg){
		if( window.console )
			window.console.log('log: '+msg);
	},
	warn:function(msg){
		if( window.console )
			window.console.log('warn: '+msg);
	},
	debug:function(msg){
		if( window.console )
			window.console.log('debug: '+msg);
	},
	info:function(msg){
		if( window.console )
			window.console.log('info: '+msg);
	}
};
//加入自动加时间戳扩展
$._ajax = $.ajax;
$.ajax = function(opt){
	var timestamp = new Date().getTime();
	if( opt.url.indexOf('?') == -1 )
		opt.url = opt.url +'?t='+timestamp;
	else
		opt.url = opt.url +'&t='+timestamp;
	opt.cache = false;
	$._ajax(opt);
};
//全局唯一数字
(function(){
	var $i = 10000;
	$.uniqueNum = function(){
		$i++;
		var id = 'id_'+$i;
		return id;
	}
})();
//加入安全扩展
$.security = {
	htmlEncode:function (value){
		return $('<div/>').text(value).html();
	},
	urlEncode:function (value){
		return encodeURI(value);
	},
	jsEncode:function (value){
		return escape(value);
	}
};
//加入动态添加样式表扩展
$.addCssToHead = function(str_css) {
	try { 
		//IE下可行
		var style = document.createStyleSheet();
		style.cssText = str_css;
	}catch (e) { 
		//Firefox,Opera,Safari,Chrome下可行
		var style = document.createElement("style");
		style.type = "text/css";
		style.textContent = str_css;
		document.getElementsByTagName("HEAD").item(0).appendChild(style);
	}
};
//加入JSON扩展
(function($){
	$.JSON = {};
	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	 
	if (typeof(JSON)=='object' && typeof JSON.stringify === "function") {
		$.JSON.stringify = JSON.stringify;
	} else {
		 $.JSON.stringify = function(value, replacer, space) {
			var i; gap = ""; indent = ""; 
			if (typeof space === "number") {
				for (i = 0; i < space; i += 1) {
					indent += " "; 
				} 
			} else {
				if (typeof space === "string") {
					indent = space; 
				} 
			} 
			rep = replacer; 
			if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
				throw new Error("JSON.stringify"); 
			} 
			return str("", {"": value }); 
		}; 
	} 
	
	if (typeof(JSON)=='object' && typeof JSON.parse === "function") {
		$.JSON.parse = JSON.parse;
	} else {
		$.JSON.parse = function(text, reviver) {
			var j; 
			function walk(holder, key) {
				var k, v, value = holder[key]; 
				if (value && typeof value === "object") {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
								v = walk(value, k); 
								if (v !== undefined) {value[k] = v; } 
							else {delete value[k]; }
						} 
					} 
				} 
				return reviver.call(holder, key, value); 
			} 
			text = String(text); 
			cx.lastIndex = 0; 
			if (cx.test(text)) {
				text = text.replace(cx, function(a) {
				return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4); }); 
			} 
			if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
				j = eval("(" + text + ")"); 
				return typeof reviver === "function" ? walk({"": j }, "") : j; 
			} 
			throw new SyntaxError("JSON.parse"); 
		};
	}
})($);
//加入版本扩展
(function(jQuery) {
	jQuery.extend({os: {ios: false,android: false,version: false}});
	var ua = navigator.userAgent;
	var browser = {}, weixin = ua.match(/MicroMessenger\/([^\s]+)/), webkit = ua.match(/WebKit\/([\d.]+)/), android = ua.match(/(Android)\s+([\d.]+)/), ipad = ua.match(/(iPad).*OS\s([\d_]+)/), ipod = ua.match(/(iPod).*OS\s([\d_]+)/), iphone = !ipod && !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/), webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/), touchpad = webos && ua.match(/TouchPad/), kindle = ua.match(/Kindle\/([\d.]+)/), silk = ua.match(/Silk\/([\d._]+)/), blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/), mqqbrowser = ua.match(/MQQBrowser\/([\d.]+)/), chrome = ua.match(/CriOS\/([\d.]+)/), opera = ua.match(/Opera\/([\d.]+)/), safari = ua.match(/Safari\/([\d.]+)/),ie = ua.match(/MSIE ([\d.]+)/),gecko = ua.match(/Gecko\/([\d.]+)/),opera = ua.match(/Opera\/([\d.]+)/);
	//浏览器内核判断
	if( gecko ){
		jQuery.os.gecko = true;
		jQuery.os.geckoversion = gecko[1];
	}
	if( webkit ){
		jQuery.os.webkit = true;
		jQuery.os.webkitversion = webkit[1];
	}
	if( ie ){
		jQuery.os.ie = true;
		jQuery.os.ieversion = ie[1];
	}
	if( opera ){
		jQuery.os.opera = true;
		jQuery.os.operaversion = opera[1];
	}
	//手机型号判断
	if (android) {
		jQuery.os.android = true;
		jQuery.os.version = android[2];
	}
	if (iphone) {
		jQuery.os.ios = jQuery.os.iphone = true;
		jQuery.os.version = iphone[2].replace(/_/g, '.');
	}
	if (ipad) {
		jQuery.os.ios = jQuery.os.ipad = true;
		jQuery.os.version = ipad[2].replace(/_/g, '.');
	}
	if (ipod) {
		jQuery.os.ios = jQuery.os.ipod = true;
		jQuery.os.version = ipod[2].replace(/_/g, '.');
	}
	//应用判断
	if (weixin) {
		jQuery.os.wx = true;
		jQuery.os.wxVersion = weixin[1];
	}
	window.htmlEncode = function(text) {
		return text.replace(/&/g, '&amp').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
	window.htmlDecode = function(text) {
		return text.replace(/&amp;/g, '&').replace(/&quot;/g, '/"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	}
	window.NETTYPE = 0;
	window.NETTYPE_FAIL = -1;
	window.NETTYPE_WIFI = 1;
	window.NETTYPE_EDGE = 2;
	window.NETTYPE_3G = 3;
	window.NETTYPE_DEFAULT = 0;
	$.console.log($.JSON.stringify(jQuery.os));
})($);
//加入FastClick扩展
(function(){
	if( $.os.android == true || $.os.ios == true ){
		$(document).ready(function(){
			require.async('lib/fastclick',function(fastclick){
				fastclick.FastClick.attach(document.body);
			});
		});
	}
})();
//加入base64扩展
(function($){
	$.base64 = {
		is_unicode: true,
		
		encode: function(input,is_unicode) {
			if( typeof is_unicode == 'undefined' || is_unicode == null )
				is_unicode = this.is_unicode;
			if (is_unicode) 
				input = this._u2a(input);
			var output = '';
			var chr1, chr2, chr3 = '';
			var enc1, enc2, enc3, enc4 = '';
			var i = 0;
			do {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output = output + this._keys.charAt(enc1) + this._keys.charAt(enc2) + this._keys.charAt(enc3) + this._keys.charAt(enc4);
				chr1 = chr2 = chr3 = '';
				enc1 = enc2 = enc3 = enc4 = '';
			} while (i < input.length);
			return output;
		},

		decode: function(input,is_unicode) {
			if( typeof is_unicode == 'undefined' || is_unicode == null )
				is_unicode = this.is_unicode;
			var output = '';
			var chr1, chr2, chr3 = '';
			var enc1, enc2, enc3, enc4 = '';
			var i = 0;
			if (input.length % 4 != 0) {
				return '';
			}
			var base64test = /[^A-Za-z0-9\+\/\=]/g;
			if (base64test.exec(input)) {
				return '';
			}
			do {
				enc1 = this._keys.indexOf(input.charAt(i++));
				enc2 = this._keys.indexOf(input.charAt(i++));
				enc3 = this._keys.indexOf(input.charAt(i++));
				enc4 = this._keys.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if (enc3 != 64) {
					output += String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output += String.fromCharCode(chr3);
				}
				chr1 = chr2 = chr3 = '';
				enc1 = enc2 = enc3 = enc4 = '';
			} while (i < input.length);

			if (is_unicode) 
				output = this._a2u(output);
			return output;
		},

		_keys: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
		
		_u2a: function(asContents) {
			var len1 = asContents.length;
			var temp = '';
			for (var i = 0; i < len1; i++) {
				var varasc = asContents.charCodeAt(i);
				if( varasc < 0x80 ){
					temp += String.fromCharCode(varasc);
				}else if( varasc < 0x800 ){
					var chr1=varasc&0xff;
					var chr2=(varasc>>8)&0xff;
					temp+=String.fromCharCode(0xC0|(chr2<<2)|((chr1>>6)&0x3));
					temp+=String.fromCharCode(0x80|(chr1&0x3F));
				}else{
					var chr1=varasc&0xff;
					var chr2=(varasc>>8)&0xff;
					temp+=String.fromCharCode(0xE0|(chr2>>4));
					temp+=String.fromCharCode(0x80|((chr2<<2)&0x3C)|((chr1>>6)&0x3));
					temp+=String.fromCharCode(0x80|(chr1&0x3F));
				}
			}
			return temp;
		},
		_a2u: function (utftext) {
			var string = "", i = 0, c = 0, c1 = 0, c2 = 0;

			while ( i < utftext.length ) {

				c = utftext.charCodeAt(i);

				if (c < 128) {

					string += String.fromCharCode(c);
					i++;

				} else if((c > 191) && (c < 224)) {

					c1 = utftext.charCodeAt(i+1);
					string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
					i += 2;

				} else {

					c1 = utftext.charCodeAt(i+1);
					c2 = utftext.charCodeAt(i+2);
					string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
					i += 3;

				}

			}

			return string;
		}
	};
})($);
//加入cookie扩展
(function($){
	$.cookie = function(name, value, options) {
		if (typeof value != 'undefined') { // name and value given, set cookie
			options = options || {};
			if (value === null) {
				value = '';
				options.expires = -1;
			}
			var expires = '';
			if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
				var date;
				if (typeof options.expires == 'number') {
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
				} else {
					date = options.expires;
				}
				expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
			}
			var path = options.path ? '; path=' + options.path : '';
			var domain = options.domain ? '; domain=' + options.domain : '';
			var secure = options.secure ? '; secure' : '';
			document.cookie = [name, '=', $.base64.encode($.JSON.stringify(value)), expires, path, domain, secure].join('');
		} else { // only name given, get cookie
			var cookieValue = null;
			if (document.cookie && document.cookie != '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = jQuery.trim(cookies[i]);
					// Does this cookie string begin with the name we want?
					if (cookie.substring(0, name.length + 1) == (name + '=')) {
						cookieValue = $.JSON.parse($.base64.decode(cookie.substring(name.length + 1)));
						break;
					}
				}
			}
			return cookieValue;
		}
	};
})($);
//加入地址栏扩展
(function($){
	$.location = {
		getQueryArgv:function(name){
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = decodeURI(window.location.search).substr(1).match(reg);
			if (r != null) 
				return unescape(r[2]); 
			return null;
		},
		getHashArgv:function( name ){
			var reg = new RegExp("(^|&|#)" + name + "=([^&]*)(&|$)", "i");
			var r = decodeURI(window.location.hash).substr(1).match(reg);
			if (r != null) 
				return unescape(r[2]); 
			return null;
		},
		setHashArgv:function(name,value){
			window.location.hash = '#'+name+'='+value;
		},
		redirect:function(a){
			location.href = a;
		},
		refresh:function(){
			history.go(0);
		},
		back:function(){
			history.go(-1);
		},
		getUrl:function(){
			return window.location;
		}
	};
})($);

return $;

});
;define('fishstrap/ui/dialog', function(require, exports, module){

//载入JQuery，以及bootstrap插件
var $ = require('fishstrap/core/global');
var GRI = require('fishstrap/ui/gri/gri');
return {
	message:function(msg,callback){
		var title = '提示信息';
		var itype = 3;
		var desc ='';
		var dialog = new GRI.Dialog({ 
			title : title, 
			type : itype, 
			btnType : 3, 
			content : msg,
			winSize : 2,
			desc:desc,
			extra : {
				zIndex : 99999,
				winSize : 2
			}
		}, callback ); 
	},
	confirm:function(msg,callback){
		var title = '提示信息';
		var itype = 3;
		var desc ='';
		var dialog = new GRI.Dialog({ 
			title : title, 
			type : itype, 
			btnType : 1, 
			content : msg,
			winSize : 2,
			desc:desc,
			extra : {
				zIndex : 99999,
				winSize : 2
			}
		}, callback );
	},
	loadingBegin:function(){
		var loadingDiv = document.createElement('div');
		loadingDiv.id = '__loading';
		loadingDiv.className = 'gri_body_loading';
		loadingDiv.innerHTML = "<img src='/fishstrap/img/loading.gif' alt='加载中...' />";
		loadingDiv.style.position = "absolute";
		loadingDiv.style.left = "49%";
		loadingDiv.style.top = "45%";
		loadingDiv.style.zIndex = '9999999';
		$('body').append(loadingDiv);
	},
	loadingEnd:function(){
		$('#__loading').remove();
	}
};

});
;define('fishstrap/ui/gri/gri', function(require, exports, module){

/**
 * ===========================================
 * GRI 前台JS框架
 * 描述： 主要包含一些公用类库函数，工具函数的抽取。
 * 使用统一的命名空间管理  GRI
 * ===========================================
 */
/**
 * @description GRI 全局对象，负责前端的交互组织
 * @namespace 全局的命名空间
 */
/*
*@require fishstrap/ui/gri/gri.css
*/
GRI = window.GRI || {};

/**
 * @namespace GRI JS框架工具类型，里面会累积一下大家常用的工具类函数和对象方法
 */
GRI.Util = {
	
	/**
	 * @description 解析url
	 * @param {String} 请求url串
	 * @return
	 * @type Object
	 * @example GRI.Util.parse_url('http://mta.oa.com/base/ctr_portrait?app_id=110000011')
	 */
	parse_url : function(url) {
		var host, path, search, hash, param = {};
		if(url === undefined) {
			var loc = window.location;
			host = loc.host;
			path = loc.pathname;
			search = loc.search.substr(1);
			hash = loc.hash;
		} else {
			var ret = url.match(/\w+:\/\/((?:[\w-]+\.)+\w+)(?:\:\d+)?(\/[^\?\\\"\'\|\:<>]*)?(?:\?([^\'\"\\<>#]*))?(?:#(\w+))?/i) || [];
			host = ret[1];
			path = ret[2];
			search = ret[3];
			hash = ret[4];
		}
		search && function() {
			var arr = search.split('&');
			for(var i = 0, l = arr.length; i < l; i++) {
				//var p=arr[i].split('=');
				//param[p[0]]=p[1];
				if(arr[i].indexOf('=') != -1) {
					var pos = arr[i].indexOf('=');
					var k = arr[i].slice(0, pos);
					var v = arr[i].slice(pos + 1);
					param[k] = v;
				}
			}
		}();
		return {
			host : host,
			path : path,
			search : search,
			hash : hash,
			param : param
		}
	},
	
	/**
	 * cookie存储的工具类函数
	 */
	cookie : {
		getTopDomain : function() {
			var top = window.location.host, list = {
				'com.cn' : 1,
				'net.cn' : 1,
				'gov.cn' : 1,
				'com.hk' : 1
			}, arr = top.split('.');
			//配置最常用的地区域名名单
			arr.length > 2 && function() {
				top = (list[arr.slice(-2).join('.')] ? arr.slice(-3) : arr.slice(-2)).join('.');
			}();
			return top;
		},
		get : function(key) {
			var ret = document.cookie.match(new RegExp("(?:^|;\\s)" + key + "=(.*?)(?:;\\s|$)"));
			return ret ? ret[1] : "";
		},
		save : function(key, value, expires) {
			document.cookie = key + "=" + value + ";path=/;domain=" + this.getTopDomain() + ( expires ? ";expires=" + expires : '');
		}
	},
	
	/**
	 * @description 为某一个元素增加数据加载中的遮罩层
	 * example GRI.Util.loading.show('container');
	 */
	loading : {
		prefix : 'mask4',
		/**
		 * 显示遮罩层
		 * id : 容器ID
		 * extra : 额外配置数据
		 */
		show : function(id, extra) {
			if(id && $('#' + this.prefix + id).length > 0) {
				return false;
			}
			var that = this;
			var style = function() {
				if($('#' + id).length > 0) {
					return {
						width : $('#' + id).width(),
						height : $('#' + id).height(),
						offset : $('#' + id).offset(),
						padding : $('#' + id).css('padding')
					};
				}
				return null;
			}();
			if(style) {
				$('<div id="' + that.prefix + id + '"><i class="icon-loading"></i>&nbsp;数据加载中...</div>').css({
					height : style.height + 'px',
					left : style.offset.left + 'px',
					position : 'absolute',
					padding : style.padding,
					'padding-top' : '25px',
					top : style.offset.top + 'px',
					'text-align' : 'center',
					width : style.width + 'px',
					background : '#FFF',
					'opacity' : 0.4,
					'z-index' : 98
				}).appendTo('body');
			}
		},
		/**
		 * 清除遮罩层
		 * id : 容器ID
		 */
		clear : function(id) {
			if(id && $('#' + this.prefix + id).length > 0) {
				$('#' + this.prefix + id).remove();
			} else {
				$('div[id^="' + this.prefix + '"]').each(function() {
					$(this).remove();
				});
			}
		}
	},
	
	/**
	 * @description 页面悬浮显示tips
	 * @author alexmiao
	 * @example GRI.Util.tool_tips.show('测试tooltips', 'containerId');
	 */
	tool_tips:{
		 show:function(title,elem){
			 var tipsContainer='<div class="tips-small" style="display:none" > '+
			                                 '<p>'+title+'</p>'+
			                           '</div>';
			    var divoffset=10;
		        var tips=$(tipsContainer);
		        $("body").append(tips);
		        
		        var leftpos,toppos;
			 
	             $("#"+elem).bind('mouseover',function(e){
	            	  Mouse(e);
	            	  tips.show().css({ top: toppos ,left: leftpos });
		           }).bind('mousemove',function(e){
		        	   Mouse(e);
		               tips.show().css({ top: toppos ,left: leftpos });
		           }).bind('mouseout',function(){
		        	   tips.hide();
				  });
			
			      
		      
			     //计算坐标函数
			     var Mouse = function(e){
			         mouse = new MouseEvent(e);
			         leftpos = mouse.x + divoffset;
			         toppos = mouse.y + divoffset;
			     }
			     //获取鼠标坐标函数
			     var MouseEvent = function(e) {
			         this.x = e.pageX
			         this.y = e.pageY
			     }
			 
		 }

	},
	
	/**
	 * @description 全屏遮罩层管理器
	 * @author johnnyzheng(johnnyzheng@tencent.com)
	 * @version 2013-01-08 init
	 * @example GRI.Util.mask.create();
	 */
	mask : {
		self : '',
		//isIE6 : $.browser.msie && $.browser.version < 7,
		create : function() {
			if(this.self && this.self.parent().length) {
				return;
			}
			$(window).bind('resize.overlay', this.resize);
			return (this.self = (this.self || $('<div></div>').css({
				height : '100%',
				left : 0,
				position : 'fixed',
				top : 0,
				width : '100%',
				background : '#E8E9EE',
				'opacity' : 0.3,
				'z-index' : 777
			})).appendTo('body').css({
				width : this.width(),
				height : this.height()
			}));
		},
		destroy : function() {
			if(this.self && !this.self.parent().length) {
				return;
			}
			$([document, window]).unbind('resize.overlay');
			this.self.animate({
				opacity : 'hide'
			}, function() {
				$(this).remove().show();
			});
		},
		height : function() {
			var scrollHeight, offsetHeight;
			if(this.isIE6) {
				scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
				offsetHeight = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight);
				if(scrollHeight < offsetHeight) {
					return $(window).height() + 'px';
				} else {
					return scrollHeight + 'px';
				}
			} else {
				return $(document).height() + 'px';
			}
		},
		width : function() {
			var scrollWidth, offsetWidth;
			if(this.isIE6) {
				scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
				offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);
				if(scrollWidth < offsetWidth) {
					return $(window).width() + 'px';
				} else {
					return scrollWidth + 'px';
				}
			} else {
				return $(document).width() + 'px';
			}
		}
	}
}

/**
 * @description 弹出窗口
 * @param {Object} json 配置数组
 * @param {Object} callback 回调函数
 * @expample  var dialog = new GRI.Dialog( {
				 type: 1,
				 title: '选择渠道',
				 content: 'aaaaaaaaaaa',
				 detail: '',
				 btnType: 1,
				 extra: {top: 250},
				 winSize : 2
				 }, function(){});
 */
GRI.Dialog = function(json, callback) {
	var defaults = {
		type : 1, //对话框类型，1：通用类型，接收html内容,	2：控件，
		//			3：纯文本 -- 提示信息，绿色，	4：纯文本 -- 警告信息，橙色
		//			5：纯文本 -- 警告信息，红色		6：纯文本 -- 错误信息，红色
		title : '温馨提示',
		hideCloseIcon : false, //是否显示右上角的关闭图标
		content : '',
		detail : '',
		tips : '',
		btnType : 1, //按钮类型，1：确定，取消  2：是，否  3，确定  false，4：继续，false，5：不显示按钮，6，自定义按钮
		buttons : {
			text1 : '',
			text2 : ''
		},
		winSize : 1, //窗体大小，1：小窗体，样式为min，2：大窗体，样式为 mid
		extra : { //扩展信息，如控制对话框宽度，显示层次，位置等
			top : '',
			left : '',
			width : '100%',
			zIndex : 1001,
			heatmap : '', //是否是热区图页面，兼容旧版
			noPrompt : '', //是否显示“下次不再显示”复选框，待实现
			autoMask : true,
			autoClose : true
		}
	}; !json.extra && (json.extra = defaults.extra);
	var opts = $.extend(true, defaults, json);
	var self = this;
	self.dialogId = '';

	var create = function() {

		var extra = opts.extra;
		var zIndex = extra['zIndex'];

		while($('#fwin_dialog_fs_100' + zIndex)[0]) {
			zIndex++;
		}
		var message_id = 'fs_100' + zIndex;
		var dialogId = 'fwin_dialog_' + message_id;
		var contentId = dialogId + '_content';
		var closeIconId = dialogId + '_closeIcon';
		var tipsId = dialogId + '_tips';
		var btnId1 = dialogId + '_btn1', btnId2 = dialogId + '_btn2', btnContainer1 = dialogId + '_btnCtn1';
		self.dialogId = dialogId;
		self.btnId1 = btnId1;
		self.btnContainer1 = btnContainer1;

		
		//var dialogPosition = ($.browser.msie && $.browser.version < 7) ? 'absolute' : 'fixed';
		var dialogPosition = "absolute";
		extra['heatmap'] && ( dialogPosition = 'absolute');
		//热区图
		var btnText1, btnText2, tips = opts.tips, btnType = opts.btnType;
		var typeList = {
			1 : ['确定', '取消'],
			2 : ['是', '否'],
			3 : ['确定', ''],
			4 : ['继续', ''],
			5 : ['', '']
		};
		if(btnType != 6) {
			btnType = typeList[btnType] ? btnType : 1;
			//默认取第一个
			btnText1 = typeList[btnType][0];
			btnText2 = typeList[btnType][1];
		} else {
			btnText1 = opts.buttons.text1;
			btnText2 = opts.buttons.text2;
		}

		//footer
		var footerHtml = '';
		if(tips || btnText1 || btnText2) {
			footerHtml = '	<div class="float_footer"> ';
			footerHtml += '			<div class="form-message warning"> ' + '				<div id="' + tipsId + '" class=" help-inline">' + tips + '</div> ' + '			</div> ';

			if(btnText1 || btnText2) {
				footerHtml += '		<div class="float-footer"> ';
				btnText1 && function() {
					var rawHtml = '<input type="submit" id="' + btnId1 + '"  value="' + btnText1 + '"  class="btn-normal btn-middle"/> ';  footerHtml += rawHtml;
				}();
				btnText2 && (footerHtml += '<input type="reset" id="' + btnId2 + '" value="' + btnText2 + '"  class="btn-thin btn-middle"/> ');
				footerHtml += '</div>';
			}
			footerHtml += '</div>';
		}

		var winSizeClass = {1: 'min', 2: 'mid'}[opts.winSize] || 'mid';
		var contentClass = {1: '', 2: 'frm_cont', 3: 'confirm', 4: 'confirm', 5: 'confirm',6:'confirm'}[opts.type] || '';
		var cssInfo = {3: 'success', 4:'attent', 5:'warn', 6:'error'}[opts.type] || '';
		var strHtml = ' <div id="' + dialogId + '" style="position: ' + dialogPosition + '; z-index: ' + zIndex + '" class="float cf ' + winSizeClass + '">' + '		<div class="float-header"> ' + '			<h3><a id="' + closeIconId + '" href="javascript:void(0);" class="close">&times;</a>' + opts.title + '</h3>' + '		</div>' + '		<div class="float-cont cf" style="background-color:#ffffff"> ' + '			<div class="' + contentClass + ' ' + cssInfo + '" id="' + contentId + '"> ' + '			</div> ' + '		</div> ' + footerHtml + '	</div> ';

		if(!$('#' + dialogId)[0]) {
			$(strHtml).appendTo("body");
		}

		//填充内容
		var content = opts.content;
		
		//cssInfo && ( content = '<i class="icon-confirm"></i><div class="confirm-cont">' + '<h4>' + opts.content + '<br><p class="success_info">'+ (opts.desc == undefined ? "":opts.desc)+'</p></h4> ' + '			<p>' + opts.detail + '</p></div>');

		cssInfo && ( content = '<h4>' + opts.content + '<br><p class="success_info">'+ (opts.desc == undefined ? "":opts.desc)+'</p></h4> ' + '			<p>' + opts.detail + '</p>');
		
		$('#' + contentId).html(content);

		$("#" + dialogId).show();

		//处理对话框宽度
		//var dialogWidth = extra['width'] ? parseInt(extra['width']) + 'px' : 'auto';
		$('#' + contentId).css({
			"width" : '100%'//dialogWidth
		});

		//处理对话框位置
		dialogLeft = extra['left'] || ($(window).width() - $('#' + dialogId).width()) / 2;
		dialogTop = extra['top'] || ($(window).height() - $('#' + dialogId).height()) / 2;
		$("#" + dialogId).css({
			"top" : dialogTop + "px",
			"left" : dialogLeft + "px"
		});

		//点击回调函数
		$('#' + btnId1).click(function() {
			buttonClick('btn1');
		});
		$('#' + btnId2).click(function() {
			buttonClick('btn2');
		});
		$('#' + closeIconId).click(function() {
			buttonClick('btnClose');
		});

		opts.hideCloseIcon && $('#' + closeIconId).css('display', 'none');

		var noPrompt = (extra && typeof (extra['noPrompt']) != 'undefined') ? extra['noPrompt'] : false;
		if(noPrompt) {
			$('#' + 'promptOff').html('<input type="checkbox" id="noDataPromptOff" name="noDataPromptOff" value="1" style="position:relative;top:2px;"/> 不再提醒 ');
		}

		opts.extra.autoMask && GRI.Util.mask.create();
		//自动遮盖

		// 解决IE6select控件bug
		var hidIframeId = "frm_100_" + dialogId;
		//如果已经存在，那么删除
		if($("#" + hidIframeId)) {
			$("#" + hidIframeId).remove();
		}
		hidIframe = "<iframe id=\"" + hidIframeId + "\"></iframe>";
		$(hidIframe).appendTo("body");
		zIndex = parseInt(zIndex);
		zIndex--;
		$("#" + hidIframeId).css({
			"width" : $("#" + dialogId).width(),
			"height" : $("#" + dialogId).height(),
			"position" : dialogPosition,
			"top" : $("#" + dialogId).css("top"),
			"left" : $("#" + dialogId).css("left"),
			"z-index" : zIndex,
			"scrolling" : "no",
			"border" : "0"
		});
	}, buttonClick = function(btnName) {
		//仅支持第一个按钮的点击调用回调函数
		(btnName == 'btn1' && callback) ? function() {
			callback();
			if(opts.extra.autoClose) {
				self.hideWindows();
			}
		}() : self.hideWindows();
	};

	this.hideWindows = function() {
		var dialogId = self.dialogId;
		$("#" + dialogId).hide();
		$("#" + dialogId).remove();
		$("#frm_100_" + dialogId).remove();
		//解决IE浏览器下a标签不向上冒泡的问题
		if($("div[id^='calendar_']")) {
			$("div[id^='calendar_']").css('display', 'none');
		}
		opts.extra.autoMask && GRI.Util.mask.destroy();
		//从集合中清除指定对话框
		return false;
	};

	this.closeWindows = this.hideWindows; this.showTips = function(msg) {
		var tipsId = self.dialogId + '_tips';
		$("#" + tipsId).html(msg);
	}, this.clearTips = function() {
		var tipsId = self.dialogId + '_tips';
		$("#" + tipsId).html('');
	}
	create();
	return this;
};
/*
 对话框常量
 对话框类型，1：通用类型，接收html内容,	2：控件，
 3：纯文本 -- 提示信息，绿色，	4：纯文本 -- 警告信息，橙色
 5：纯文本 -- 警告信息，红色		6：纯文本 -- 错误信息，红色
 */
GRI.Dialog.DIALOG_TYPE = {
	COMMON : 1,
	CONTROL : 2,
	TEXT_INFO : 3,
	TEXT_WARN : 4,
	TEXT_WARN_RED : 5,
	TEXT_ERROR : 6
};
/*
 对话框常量
 按钮类型，1：确定，取消  2：是，否  3，确定  false，4：继续，false，5：不显示按钮，6，自定义按钮
 */
GRI.Dialog.BUTTON_TYPE = {
	OK_CANCEL : 1,
	YES_NO : 2,
	OK : 3,
	CONTINUE : 4,
	NONE : 5,
	CUSTOMIZE : 6
};
/*
 对话框常量
 对话框尺寸，1：小窗体，2：大窗体
 */
GRI.Dialog.WIN_SIZE = {
	MIN : 1, //小窗体
	MID : 2
};

/**
 * @description 异常处理对象函数
 * @author zacharycai
 */
GRI.Exception = {
	/**
	 * 异步出错处理函数
	 */
	 griErrorHandler : function(XMLHttpRequest, textStatus, errorThrown) {
	    if (XMLHttpRequest.status === 401) {
	        //console.log("page refresh.");
	        var currentWindow = window;
	        if (window.top != window.self) {
	            currentWindow = window.top;
	        }
	        currentWindow.location.reload();
	    }
	}
};

/**
 * 重置jQuery异步的error处理
 */
$.ajaxSetup({
    "error" : GRI.Exception.griErrorHandler
});

return GRI;

});