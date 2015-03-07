var $ = require('../core/global.js');
return {
	open:function(option){
		//处理Option
		var defaultOption = {
			title:'',
			url:'',
			close:function(){
			},
		};
		for( var i in option )
			defaultOption[i] = option[i];
		//生成dialogId
		defaultOption.dialogId = $.uniqueNum();
		defaultOption.url = defaultOption.url;
		//构建基本框架
		var div = $(
			'<div class="background" id="'+defaultOption.dialogId+'">'+
				'<div class="container">'+
					'<div class="tip"></div>'+
					'<div class="closeicon">ｘ</div>'+
					'<div class="frame">'+
						'<iframe></iframe>'+
					'</div>'+
					'<div class="footer">'+
						'<div class="cancelicon">取消</div>'+
						'<div class="confirmicon">确定</div>'+
					'</div>'+
				'</div>'+
			'</div>'
		);
		div.css({
			'position':'fixed',
			'top':'0px',
			'bottom':'0px',
			'left':'0px',
			'right':'0px',
			'width':'100%',
			'height':'100%',
			'z-index':'99999',
			'background':'rgba(232, 233, 238,0.3)',
		});
		div.find(".container").css({
			'position':'absolute',
			'top':'0px',
			'bottom':'0px',
			'left':'0px',
			'right':'0px',
			'width':'95%',
			'height':'95%',
			'margin':'auto auto',
			'box-shadow':'1px 1px 8px rgba(0, 0, 0, 0.35)',
			'border':'1px solid #737373'
		});
		div.find(".closeicon").css({
			'position':'absolute',
			'top':'10px',
			'right':'10px',
			'font-size':'20px',
			'color':'#666',
			'cursor':'pointer',
		});
		div.find(".closeicon").hover(function(){
			div.find(".closeicon").css({'color':'#666'});
		},function(){
			div.find(".closeicon").css({'color':'#9a9a9a'});
		});
		div.find(".tip").css({
			'height':'45px',
			'color':'#4c4c4c',
			'line-height':'45px',
			'padding-left':'15px',
			'background':'#f0f0f0',
			'border-bottom':'1px solid #d5d5d5'
		});
		div.find(".frame").css({
			'position':'absolute',
			'top':'46px',
			'bottom':'61px',
			'left':'0px',
			'right':'0px',
		});
		div.find("iframe").css({
			'position':'absolute',
			'top':'0px',
			'bottom':'0px',
			'left':'0px',
			'right':'0px',
			'width':'100%',
			'height':'100%',
			'border':'0px',
			
		});
		div.find(".footer").css({
			'position':'absolute',
			'bottom':'0px',
			'left':'0px',
			'right':'0px',
			'height':'60px',
			'color':'#4c4c4c',
			'background':'#f0f0f0',
			'border-top':'1px solid #d5d5d5'
		});
		div.find(".cancelicon").css({
			'float':'right',
			'margin-top':'17px',
			'margin-right':'15px',
			'font-size':'14px',
			'padding':'5px 15px 5px 15px',
			'line-height':'20px',
			'color':'rgb(51, 51, 51)',
			'cursor':'pointer',
			'background':'#f5f5f5',
			'border':'1px solid #cccccc',
			'border-radius':'2px',
		});
		div.find(".confirmicon").css({
			'float':'right',
			'margin-top':'17px',
			'margin-right':'15px',
			'font-size':'14px',
			'padding':'5px 15px 5px 15px',
			'line-height':'20px',
			'color':'#fff',
			'cursor':'pointer',
			'background':'#288cc8',
			'border':'1px solid #0a6eaa',
			'border-radius':'2px',
		});
		div.find(".tip").text(defaultOption.title);
		div.find("iframe").attr('src',defaultOption.url);
		div.find("iframe").attr('frameborder',"no");
		function whenOperation(state){
			return operation = {
				close:function(argv){
					div.remove();
					defaultOption.close(state,argv);
				}
			};
		}
		function whenCancel(){
			div.find('iframe')[0].contentWindow.whenWindowClose('cancel',whenOperation('cancel'));
		}
		function whenConfirm(){
			div.find('iframe')[0].contentWindow.whenWindowClose('confirm',whenOperation('confirm'));
		}
		div.find(".closeicon").click(whenCancel);
		div.find(".cancelicon").click(whenCancel);
		div.find(".confirmicon").click(whenConfirm);
		$('body').append(div);
	}
}