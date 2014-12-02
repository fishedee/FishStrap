define('page/browserCheck',['core/global'], function(require, exports, module){
	var $ = require('core/global');
	var self = {};
	self._checkVersion = function(){
		if( $.os.ie && $.os.ieversion < 9 ){
			return '很抱歉你的浏览器版本太低，不能访问该网站，请使用最新版的chrome,firefox,360或QQ浏览器';
		}else{
			return true;
		}
	};
	self._showTip = function(text){
		var div = $(
			'<div class="container">'+
				'<div class="img">'+
					'<img src="img/apologise.jpg"/>'+
				'</div>'+
				'<div class="text">'+
				'</div>'+
			'</div>'
		);
		div.css({
			'position':'fixed',
			'top':'0px',
			'bottom':'0px',
			'left':'0px',
			'right':'0px',
			'width':'400px',
			'max-width':'100%',
			'height':'100px',
			'margin':'auto auto'
		});
		div.find(".img").css({
			'float':'left'
		});
		div.find("img").css({
			'height':'100px'
		});
		div.find(".text").css({
			'font-size':'14px',
			'margin-top':'40px'
		});
		div.find(".text").text(text);
		$('body').empty();
		$('body').append(div);
	};
	self.checkAndGo = function(js){
		var result = this._checkVersion();
		if( result === true )
			require.async(js);
		else
			this._showTip(result);
	};
	return self;
});