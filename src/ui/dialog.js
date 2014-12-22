
/*
*载入依赖的gri.js
*@require ../lib/gri/gri.js
*/
var $ = require('../core/global.js');
module.exports = {
	init:function(){
		//扩展global
		var self = this;
		$._dialogAjax = $.ajax;
		$.ajax = function(opt){
			self.loadingBegin();
			var tempComplete = opt.complete;
			opt.complete = function(XMLHttpRequest,textStatus){
				self.loadingEnd();
				if( tempComplete )
					tempComplete(XMLHttpRequest,textStatus);
			}
			var tempError = opt.error;
			opt.error = function(XMLHttpRequest, textStatus, errorThrown){
				dialog.message('网络错误，请稍后再试，网络错误码'+XMLHttpRequest.status);
				if( tempError )
					tempError(XMLHttpRequest, textStatus, errorThrown);
			}
			$._dialogAjax(opt);
		}
	},
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
		loadingDiv.innerHTML = "<img src='"+__uri('./loading.gif')+"' alt='加载中...' />";
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
module.exports.init();