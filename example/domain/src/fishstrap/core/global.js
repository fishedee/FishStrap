/*
* 依赖jquery.js
* @require ../lib/underscore.js
* @require ../lib/jquery.js
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