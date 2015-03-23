var $ = require('./global.js');
var self = {};
//加入localStorage扩展
self.localStorage = function(name, value, options) {
	function supports_html5_storage() {   
		try {   
			return 'localStorage' in window && window['localStorage'] !== null;   
		}catch (e) {   
			return false;   
		}   
	}
	if( supports_html5_storage() == false )
		return null;
	if (typeof value != 'undefined') { // name and value given, set localStorage
		options = options || {};
		if (value === null ) {
			value = '';
			localStorage.removeItem(name); 
			return null;
		}
		//设置过期时间
		var data = {};
		data.data = value;
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			data.expires = date.toUTCString();
		}
		//删除过期数据
		for( var i = 0 , len = localStorage.length ; 
			i < len ; ++i ){
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			try{
				value = $.JSON.parse($.base64.decode(value));
			}catch(e){
				continue;
			}
			var now = new Date();
			if( value.expires && Date.parse(value.expires) < Date.parse(now)){
				localStorage.removeItem(key);
			}
		}
		//设置数据
		localStorage.removeItem(name);
		localStorage.setItem(name,$.base64.encode($.JSON.stringify(data)));
	}else{
		//获取数据
		var localStorageValue = localStorage.getItem(name);
		if( typeof localStorageValue == 'undefined' ||  localStorageValue == null )
			return null;
		//删除过期数据
		var now = new Date();
		localStorageValue = $.JSON.parse($.base64.decode(localStorageValue));
		if( localStorageValue.expires && Date.parse(localStorageValue.expires) < Date.parse(now)){
			localStorage.removeItem(name);
			return null;
		}
		return localStorageValue.data;
		
	}
};
//加入history扩展
self.history = {
	pushState:function(data,state,url){
		if(window.history.pushState){
			window.history.pushState(data,state,url);
		}else{
			location.href = url;
		}

	},
	replaceState:function(data,state,url){
		if(window.history.replaceState){
			window.history.replaceState(data,state,url);
		}else{
			location.href = url;
		}
	},
};
//加入ArrayBuffer扩展
self.arraybuffer = {
	fromString:function(data){
		var arraybuffer = new ArrayBuffer(data.length);
		var longInt8View = new Uint8Array(arraybuffer);

		for (var i=0; i< longInt8View.length; i++) {
			longInt8View[i] = data.charCodeAt(i);
		}
		return arraybuffer;
	}
};
//加入Blob扩展
self.blob = {
	fromArray:function(array){
		try{
		  var jpeg = new Blob( [array],{type:"image/jpeg"});
		}
		catch(e){
			alert(e.name);
			alert(e);
		    // TypeError old chrome and FF
		    window.BlobBuilder = window.BlobBuilder || 
		                         window.WebKitBlobBuilder || 
		                         window.MozBlobBuilder || 
		                         window.MSBlobBuilder;
		    alert(window.BlobBuilder);
		    if(e.name == 'TypeError' && window.BlobBuilder){
		    	alert('TypeError!');
		        var bb = new BlobBuilder();
		        bb.append(array.buffer);
		        var jpeg = bb.getBlob("image/jpeg");
		        alert(jpeg.size);
		    }
		    else if(e.name == "InvalidStateError"){
		        var jpeg = new Blob( [array.buffer], {type : "image/jpeg"});
		    }
		    else{
		       	var jpeg = null;
		    }
		}
		return jpeg;
	},
	fromString:function(data){
		var arr = new Uint8Array(data.length);
	    for(var i = 0, l = data.length; i < l; i++) {
	        arr[i] = data.charCodeAt(i);
	    }
	    return this.fromArray(arr);
	}
};
//加入FileReader扩展
self.fileReader = {
	open:function(option){
		//处理option
		option = option || {};
		var defaultOption = {
			file:null,
			mode:'binary',
			onStart:function(){
			},
			onProgress:function(e){
			},
			onSuccess:function(){
			},
			onFail:function(msg){
			},
			onStop:function(){
			}
		};
		for( var i in option )
			defaultOption[i] = option[i];
		defaultOption.mode = defaultOption.mode.toLowerCase();
		//开始执行
		defaultOption.onStart();
		if( typeof window.FileReader  == 'undefined' ||
			typeof window.Blob  == 'undefined'){
			defaultOption.onFail('您的浏览器不支持FileReader');
			defaultOption.onStop();
			return;
		}
		var reader  = new FileReader();
		reader.onabort = function(){
			defaultOption.onFail('读取文件失败');
			defaultOption.onStop();
		};
		reader.onerror = function(){
			defaultOption.onFail('读取文件失败');
			defaultOption.onStop();
		};
		reader.onprogress = function(e){
			var percent = 0;
			if(e.lengthComputable){
				var percent = Math.ceil(100 * (e.loaded / e.total));
			}
			defaultOption.onProgress(percent);
		};
		reader.onload = function(e){
			if( defaultOption.mode == 'binary'
				&& typeof reader.readAsBinaryString == 'undefined' ){
				defaultOption.onSuccess($.base64.decode(this.result.substr(this.result.indexOf(',')+1),false));
				defaultOption.onStop();
			}else{
				defaultOption.onSuccess(this.result);
				defaultOption.onStop();
			}
		};
		if( defaultOption.mode == 'text'){
			//文本格式
			reader.readAsText(defaultOption.file);
		}else if( defaultOption.mode == 'dataurl'){
			//dataurl格式
			reader.readAsDataURL(defaultOption.file);
		}else if( defaultOption.mode == 'arraybuffer' ){
			//arraybuffer格式
			reader.readAsArrayBuffer(defaultOption.file);
		}else{
			defaultOption.mode = 'binary';
			//二进制格式
			if( reader.readAsBinaryString )
				reader.readAsBinaryString(defaultOption.file);
			else
				reader.readAsDataURL(defaultOption.file);
		}
	}
};
return self;