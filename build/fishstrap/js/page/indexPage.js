define('page/indexPage',['core/global','../../css/common.css'], function(require, exports, module){
	//载入JQuery
	var $ = require('core/global');
	return {
		use:function(option){
			//处理Option
			option = option || {};
			var defaultOption = {
				title:'后台管理系统',
				menu:[],
				logout:function(){
				},
				init:function(){
				}
			};
			for( var i in option )
				defaultOption[i] = option[i];
			//添加基本框架
			var menu = "";
			for( var name in defaultOption.menu ){
				var items = defaultOption.menu[name];
				menu +=
				'	<div class="category">'+
				'		<div class="head">'+name+'</div>';
				for( var i in items ){
					var item = items[i];
					menu += '<a href="'+item.url+'" target="myframe">'+
					'<div class="title">'+item.name+'</div>'+
					'</a>';
				}
				menu += '</div>';
			}
			var div = 
				'<div class="comm_abtop" id="topbar">'+
				'	<div class="comm_leftcol item" id="title">'+defaultOption.title+'</div>'+
				'	<div class="comm_rightcol item button" id="logout">[退出]</div>'+
				'</div>'+
				'<div class="comm_ableft" id="leftbar">'+
					menu+
				'</div>'+
				'<div class="comm_abright" id="rightbar">'+
				'	<div id="pageTitle">用户管理</div>'+
				'	<div id="pageLine"></div>'+
				'</div>'+
				'<div class="comm_abfull" id="centerbar">'+
				'	<iframe name="myframe" src="" frameborder="no"/>'+
				'</div>';
			div = $(div);
			//设置样式
			$.addCssToHead(
				'#topbar{'+
				'	height:50px;'+
				'	background:#222;'+
				'	background-image:linear-gradient(to bottom,#3c3c3c 0,#222 100%);'+
				'	background-repeat:repeat-y;'+
				'	border-color:#080808;'+
				'}'+
				'#topbar .item{'+
				'	font-size:18px;'+
				'	line-height:50px;'+
				'	color:#777;'+
				'	text-shadow:0 -1px 0 rgba(0,0,0,.25);'+
				'	transition:color 0.5s;'+
				'}'+
				'#topbar .item:hover{'+
				'	cursor:pointer;'+
				'	color:#fff;'+
				'}'+
				'#topbar #title{'+
				'	margin-left:15px;'+
				'}'+
				'#topbar .button{'+
				'	font-size:14px;'+
				'	margin-right:15px;'+
				'}'+
				'#leftbar{'+
				'	top:50px;'+
				'	width:200px;'+
				'	background:#f5f5f5;'+
				'	border-right:1px solid #eee;'+
				'}'+
				'#leftbar .category:first-child{'+
				'	margin-top:15px;'+
				'}'+
				'#leftbar .category .head{'+
				'	line-height: 25px;'+
				'	height: 25px;'+
				'	font-size: 12px;'+
				'	margin-left: 15px;'+
				'	color: black;'+
				'	font-weight:bold;'+
				'}'+
				'#leftbar .category .title{'+
				'	height:40px;'+
				'	line-height:40px;'+
				'	padding-left:30px;'+
				'	background:transparent;'+
				'	transition:all 0.5s;'+
				'	font-size:14px;'+
				'	color:#2a6496;'+
				'	text-decoration:none;'+
				'}'+
				'#leftbar .category .title:hover{'+
				'	background:#eee;'+
				'	cursor:pointer;'+
				'}'+
				'#leftbar .category .activetitle{'+
				'	background:rgb(66, 139, 202);'+
				' 	color:white;'+
				'}'+
				'#leftbar .category .activetitle:hover{'+
				'	background:rgb(66, 139, 202);'+
				' 	color:white;'+
				'}'+
				'#centerbar{'+
				'	top:100px;'+
				'	left:200px;'+
				'	bottom:10px;'+
				'	padding-top:15px;'+
				'	padding-left:10px;'+
				'	padding-right:10px;'+
				'	width:auto;'+
				'	height:auto;'+
				'}'+
				'#centerbar iframe{'+
				'	width:100%;'+
				'	height:100%;'+
				'	border:0px;'+
				'}'+
				'#rightbar{'+
				'	display:none;'+
				'	top:50px;'+
				'	left:200px;'+
				'	height:50px;'+
				'	padding-top:15px;'+
				'	padding-left:10px;'+
				'	padding-right:10px;'+
				'	width:auto;'+
				'	height:auto;'+
				'}'+
				'#rightbar #pageTitle{'+
				'	font-size:24px;'+
				'	color:rgb(180,180,180);'+
				'}'+
				'#rightbar #pageLine{'+
				'	border-bottom:1px solid rgb(220,220,220);'+
				'	margin-top:20px;'+
				'}'
			);
			//设置事件
			div.find('a').click(function(){
				$('#rightbar').show();
				$('#rightbar #pageTitle').text($(this).find('.title').text());
				$('#leftbar .category .title').removeClass('activetitle');
				$(this).find('.title').addClass('activetitle');
				$.location.setHashArgv('location',$(this).attr('href'));
			});
			div.find('#logout').click(function(){
				defaultOption.logout();
			});
			//启动
			$('body').append(div);
			var location = $.location.getHashArgv('location');
			if( location != null ){
				div.find('a').each(function(){
					if( $(this).attr('href') != location )
						return;
					$(this).find('div').click();
				});
			}
			defaultOption.init();
		}
	};
});