/*
* @require ../lib/gri/gri.css
*/
var $ = require('../core/global.js');
var dialog = require('../ui/dialog.js');
return {
	use:function( option ){
		//处理Option
		option = option || {};
		var defaultOption = {
			title:'后台管理系统',
			login:function(){
			},
			init:function(){
			},
			button:[]
		};
		for( var i in option )
			defaultOption[i] = option[i];
		//添加基本框架
		var buttonDiv = '';
		for( var i = 0 ; i != defaultOption.button.length ; ++i ){
			defaultOption.button[i].id = $.uniqueNum();
			buttonDiv +=  '<a class="rightbutton" href="#" id="'+defaultOption.button[i].id+'">'+defaultOption.button[i].name+'</a>';
		}
		var div = $(
		'<div class="container">'+
			'<form class="form-signin" method="post" id="login-form">'+
				'<div class="title">烘焙帮微信后台管理系统</div>'+
				'<div class="name"><input class="input-small" type="text" name="name" placeholder="账号"></div>'+
				'<div class="password"><input class="input-small" type="password" name="password" placeholder="密码"></div>'+
				'<div class="button"><button type="button" class="btn submit">登录</button>'+buttonDiv+'</div>'+
			'</form>'+
		'</div>'
		);
		$('body').append(div);
		//设置样式
		$.addCssToHead(
			'body {'+
			'	padding-top: 40px;'+
			'	padding-bottom: 40px;'+
			'	background-color: #f5f5f5;'+
			'}'+
			'.title{'+
			'	font-size:16px;'+
			'	margin-bottom:20px;'+
			'	text-align:center;'+
			'	margin-top:10px;'+
			'}'+
			'.form-signin {'+
			'	max-width: 420px;'+
			'	padding: 5px 10px;'+
			'	margin: 0 auto 20px;'+
			'	background-color: #fff;'+
			'	border: 1px solid #e5e5e5;'+
			'	-webkit-border-radius: 5px;'+
			'	-moz-border-radius: 5px;'+
			'	border-radius: 5px;'+
			'	-webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, .05);'+
			'	-moz-box-shadow: 0 1px 2px rgba(0, 0, 0, .05);'+
			'	box-shadow: 0 1px 2px rgba(0, 0, 0, .05);'+
			'	overflow:auto;'+
			'}'+
			'.name,'+
			'.password{'+
			'	width:80%;'+
			'	margin:0 auto;'+
			'}'+
			''+
			'.form-signin input[type="text"],'+
			'.form-signin input[type="password"] {'+
			'	width:100%;'+
			'	margin-bottom: 15px;'+
			'	height: auto;'+
			'	padding: 7px 9px;'+
			'}'+
			''+
			'.button{'+
			'	overflow:auto;'+
			'	zoom:1;'+
			'	padding-left:10%;'+
			'	padding-right:10%;'+
			'	margin-bottom:15px;'+
			'}'+
			'.rightbutton{'+
			'	margin-top:10px;'+
			'	float:right;'+
			'}'+
			'.submit{'+
			'	float:left;'+
			'	padding-left:20px;'+
			'	padding-right:20px;'+
			'}'
		);
		div.find('.title').text(option.title);
		//设置事件
		div.find("input").keydown(function(e){
			var e = e || event;
			if(e.keyCode == 13) {
				var data = {
					name:$('input[name=name]').val(),
					password:$('input[name=password]').val(),
				};
				option.login(data);
			}
		});
		div.find('.submit').click(function(){
			var data = {
				name:$.trim($('input[name=name]').val()),
				password:$.trim($('input[name=password]').val()),
			};
			if( data.name == ''){
				dialog.message('请输入帐号');
				return;
			}
			if( data.password == ''){
				dialog.message('请输入密码');
				return;
			}
				
			option.login(data);
		});
		for( var i = 0 ; i != defaultOption.button.length ; ++i ){
			$('#'+defaultOption.button[i].id).click(defaultOption.button[i].click);
		}
		//启动
		option.init();
	}
};