define('ui/chart',['core/global'], function(require, exports, module) {
	var theme = {
		// 默认色板
		color: [
			'#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
			'#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
			'#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
			'#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
		],

		// 图表标题
		title: {
			itemGap: 8,
			textStyle: {
				fontWeight: 'normal',
				color: '#008acd'          // 主标题文字颜色
			}
		},
		
		// 图例
		legend: {
			itemGap: 8
		},
		
		// 值域
		dataRange: {
			itemWidth: 15,
			//color:['#1e90ff','#afeeee']
			color: ['#2ec7c9','#b6a2de']
		},

		toolbox: {
			color : ['#1e90ff', '#1e90ff', '#1e90ff', '#1e90ff'],
			effectiveColor : '#ff4500',
			itemGap: 8
		},

		// 提示框
		tooltip: {
			backgroundColor: 'rgba(50,50,50,0.5)',     // 提示背景颜色，默认为透明度为0.7的黑色
			axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				type : 'line',         // 默认为直线，可选为：'line' | 'shadow'
				lineStyle : {          // 直线指示器样式设置
					color: '#008acd'
				},
				crossStyle: {
					color: '#008acd'
				},
				shadowStyle : {                     // 阴影指示器样式设置
					color: 'rgba(200,200,200,0.2)'
				}
			}
		},

		// 区域缩放控制器
		dataZoom: {
			dataBackgroundColor: '#efefff',            // 数据背景颜色
			fillerColor: 'rgba(182,162,222,0.2)',   // 填充颜色
			handleColor: '#008acd'    // 手柄颜色
		},

		// 网格
		grid: {
			borderColor: '#eee'
		},

		// 类目轴
		categoryAxis: {
			axisLine: {            // 坐标轴线
				lineStyle: {       // 属性lineStyle控制线条样式
					color: '#008acd'
				}
			},
			splitLine: {           // 分隔线
				lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
					color: ['#eee']
				}
			}
		},

		// 数值型坐标轴默认参数
		valueAxis: {
			axisLine: {            // 坐标轴线
				lineStyle: {       // 属性lineStyle控制线条样式
					color: '#008acd'
				}
			},
			splitArea : {
				show : true,
				areaStyle : {
					color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)']
				}
			},
			splitLine: {           // 分隔线
				lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
					color: ['#eee']
				}
			}
		},

		polar : {
			axisLine: {            // 坐标轴线
				lineStyle: {       // 属性lineStyle控制线条样式
					color: '#ddd'
				}
			},
			splitArea : {
				show : true,
				areaStyle : {
					color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)']
				}
			},
			splitLine : {
				lineStyle : {
					color : '#ddd'
				}
			}
		},

		timeline : {
			lineStyle : {
				color : '#008acd'
			},
			controlStyle : {
				normal : { color : '#008acd'},
				emphasis : { color : '#008acd'}
			},
			symbol : 'emptyCircle',
			symbolSize : 3
		},

		// 柱形图默认参数
		bar: {
			itemStyle: {
				normal: {
					barBorderRadius: 5
				},
				emphasis: {
					barBorderRadius: 5
				}
			}
		},

		// 折线图默认参数
		line: {
			smooth : true,
			symbol: 'emptyCircle',  // 拐点图形类型
			symbolSize: 3           // 拐点图形大小
		},
		
		// K线图默认参数
		k: {
			itemStyle: {
				normal: {
					color: '#d87a80',       // 阳线填充颜色
					color0: '#2ec7c9',      // 阴线填充颜色
					lineStyle: {
						width: 1,
						color: '#d87a80',   // 阳线边框颜色
						color0: '#2ec7c9'   // 阴线边框颜色
					}
				}
			}
		},
		
		// 散点图默认参数
		scatter: {
			symbol: 'circle',    // 图形类型
			symbolSize: 4        // 图形大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
		},

		// 雷达图默认参数
		radar : {
			symbol: 'emptyCircle',    // 图形类型
			symbolSize:3
			//symbol: null,         // 拐点图形类型
			//symbolRotate : null,  // 图形旋转控制
		},

		map: {
			itemStyle: {
				normal: {
					areaStyle: {
						color: '#ddd'
					},
					label: {
						textStyle: {
							color: '#d87a80'
						}
					}
				},
				emphasis: {                 // 也是选中样式
					areaStyle: {
						color: '#fe994e'
					},
					label: {
						textStyle: {
							color: 'rgb(100,0,0)'
						}
					}
				}
			}
		},
		
		force : {
			itemStyle: {
				normal: {
					linkStyle : {
						strokeColor : '#1e90ff'
					}
				}
			}
		},

		chord : {
			padding : 4,
			itemStyle : {
				normal : {
					lineStyle : {
						width : 1,
						color : 'rgba(128, 128, 128, 0.5)'
					},
					chordStyle : {
						lineStyle : {
							width : 1,
							color : 'rgba(128, 128, 128, 0.5)'
						}
					}
				},
				emphasis : {
					lineStyle : {
						width : 1,
						color : 'rgba(128, 128, 128, 0.5)'
					},
					chordStyle : {
						lineStyle : {
							width : 1,
							color : 'rgba(128, 128, 128, 0.5)'
						}
					}
				}
			}
		},

		gauge : {
			startAngle: 225,
			endAngle : -45,
			axisLine: {            // 坐标轴线
				show: true,        // 默认显示，属性show控制显示与否
				lineStyle: {       // 属性lineStyle控制线条样式
					color: [[0.2, '#2ec7c9'],[0.8, '#5ab1ef'],[1, '#d87a80']], 
					width: 10
				}
			},
			axisTick: {            // 坐标轴小标记
				splitNumber: 10,   // 每份split细分多少段
				length :15,        // 属性length控制线长
				lineStyle: {       // 属性lineStyle控制线条样式
					color: 'auto'
				}
			},
			axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
				textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
					color: 'auto'
				}
			},
			splitLine: {           // 分隔线
				length :22,         // 属性length控制线长
				lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
					color: 'auto'
				}
			},
			pointer : {
				width : 5,
				color : 'auto'
			},
			title : {
				textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
					color: '#333'
				}
			},
			detail : {
				textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
					color: 'auto'
				}
			}
		},
		
		textStyle: {
			fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
		}
	};
	return {
		simpleBrokeLine:function(option){
			//处理option
			var defaultOption = {
				id:'',
				data:[],
				xAxis:'',
				yAxis:'',
				category:'',
			};
			for( var i in option )
				defaultOption[i] = option[i];
			//获取所有的xAxis与category的种类
			var xAxises = [];
			var categorys = [];
			var datas = {};
			for( var i in defaultOption.data){
				var xAxis = defaultOption.data[i][defaultOption.xAxis];
				var category = defaultOption.data[i][defaultOption.category];
				if( _.indexOf(xAxises,xAxis) == -1 )
					xAxises.push(xAxis);
				if( _.indexOf(categorys,category) == -1 )
					categorys.push(category);
				if( !datas[xAxis] )
					datas[xAxis] = {};
				datas[xAxis][category] = defaultOption.data[i][defaultOption.yAxis];
			}
			xAxises.reverse();
			//构造折点数据
			var series = [];
			for( var i in categorys ){
				var category = categorys[i];
				var itemData = {};
				itemData.name = category;
				itemData.type = 'line';
				itemData.data = [];
				for( var j in xAxises ){
					var xAxise = xAxises[j];
					if( datas[xAxise][category])
						itemData.data.push(datas[xAxise][category]);
					else
						itemData.data.push(0);
				}
				series.push(itemData);
			}
			//绘图
			var myChart = echarts.init($('#'+defaultOption.id)[0]); 
							
			option = {
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:categorys
				},
				calculable : true,
				xAxis : [
					{
						type : 'category',
						boundaryGap : false,
						data : xAxises,
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : series
			};
			// 为echarts对象加载数据 
			myChart.setTheme(theme);
			myChart.setOption(option); 
		},
		simpleSector:function( option ){
			//处理option
			var defaultOption = {
				id:'',
				data:[],
				xAxis:'',
				yAxis:'',
			};
			for( var i in option )
				defaultOption[i] = option[i];
			//获取xAxixs
			var xAxises = [];
			var datas = {};
			for( var i in defaultOption.data){
				var xAxis = defaultOption.data[i][defaultOption.xAxis];
				if( _.indexOf(xAxises,xAxis) == -1 )
					xAxises.push(xAxis);
				datas[xAxis] = defaultOption.data[i][defaultOption.yAxis];
			}
			var series = [];
			for( var i in datas ){
				series.push({
					value:datas[i],
					name:i,
				});
			}
			//绘图
			console.log(series);
			var myChart = echarts.init($('#'+defaultOption.id)[0]); 
			option = {
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					data:xAxises
				},
				calculable : true,
				series : [
					{
						type:'pie',
						data:series
					}
				]
			};
			// 为echarts对象加载数据 
			myChart.setTheme(theme);
			myChart.setOption(option); 
		}         
	};
});
define('ui/dialog',['core/global','ui/gri/gri'], function(require, exports, module) {
	//载入JQuery，以及bootstrap插件
	var $ = require('core/global');
	var GRI = require('ui/gri/gri');
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
		}
	};
});
define('ui/editor',['core/global'],function(require, exports, module){
	var $ = require('core/global');
	return {
		fullEditor:function( option ){
			//处理option
			var defaultOption =	{
				id:'',
				url:'/uedit/control',
			};
			for( var i in option )
				defaultOption[i] = option[i];
			var editorId = $.uniqueNum();
			$('#'+defaultOption.id).html(
				'<script id="'+editorId+'" name="content" type="text/plain">'+
				'</script>'
			);
			//初始化editor
			var ue = UE.getEditor(editorId, {
				serverUrl:defaultOption.url,
				autoHeightEnabled: true,
				toolbars: [
				['fullscreen', 'source', '|', 'undo', 'redo'] ,
				['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc','|','rowspacingtop', 'rowspacingbottom', 'lineheight', '|','customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
					'directionalityltr', 'directionalityrtl', 'indent', '|',
					'simpleupload', 'insertimage','pagebreak', 'template', 'background'],
				['justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
					'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter'],
				['inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts']],
			});
			//计算editor的函数
			return {
				getContent:function(){
					return ue.getContent();
				},
				setContent:function(content){
					ue.ready(function(){
						ue.setContent(content);
					});
				},
			};
		},
		simpleEditor:function(option){
			//处理option
			var defaultOption =	{
				id:'',
				url:'/uedit/control',
			};
			for( var i in option )
				defaultOption[i] = option[i];
			var editorId = $.uniqueNum();
			$('#'+defaultOption.id).html(
				'<script id="'+editorId+'" name="content" type="text/plain">'+
				'</script>'
			);
			//初始化editor
			var ue = UE.getEditor(editorId, {
				serverUrl:defaultOption.url,
				autoHeightEnabled: true,
				toolbars: [['fullscreen','simpleupload']],
			});
			//计算editor的函数
			return {
				getContent:function(){
					return ue.getContent();
				},
				getFormatData:function(){
					var content = ue.getContent();

					var div = $(content);
					var data = [];
					div.each(function(){
						var self = $(this);
						if( self.is('p') == true ){
							var hasImg = self.has('img');
							var hasText = self.text();
							if( hasImg && ! hasText ){
								self.find('img').each(function(){
									data.push({
										type:1,
										data:$(this).attr('src'),
									});
								});
							}else if( hasImg && hasText ){
								data.push({
									type:0,
									data:self.text(),
								});
								self.find('img').each(function(){
									data.push({
										type:1,
										data:$(this).attr('src'),
									});
								});
							}else{
								data.push({
									type:0,
									data:self.text(),
								});
							}
						}else if( self.is('img') == true ){
							data.push({
								type:1,
								data:self.attr('src'),
							});
						}
					});
					return data;
				},
				setContent:function(content){
					ue.ready(function(){
						ue.setContent(content);
					});
				},
				setFormatData:function(data){
					var content = "";
					for( var i in data ){
						var singleData = data[i];
						if( singleData.type == 0 )
							content += '<p>'+singleData.data+'</p>';
						else if( singleData.type == 1 )
							content += '<p><img src="'+singleData.data+'"/></p>';
					}
					ue.ready(function(){

						ue.setContent(content);
					});
				}
			};
		}
	};
});
define('ui/input',['core/global','ui/editor','ui/dialog','util/upload'], function(require, exports, module){
	var $ = require('core/global');
	var dialog = require('ui/dialog');
	var editor = require('ui/editor');
	var upload = require('util/upload');
	return {
		flowInput:function( option ){
			//处理option
			var defaultOption = {
				id:'',
				field:[],
				submit:function(){
				},
			};
			for( var i in option )
				defaultOption[i] = option[i];
			if( defaultOption.field.length == 0 )
				return;
			var div = "";
			//基本框架
			for( var i in defaultOption.field ){
				var field = defaultOption.field[i];
				if( field.type == 'text'){
					div += '<span>&nbsp;'+field.name+'：</span>' + '<input type="text" name="'+field.id+'" class="input-small"/>';
				}else if( field.type == 'enum'){
					var option = "";
					if( typeof field.map[""] != 'undefined')
						option += '<option value="">'+field.map[""]+'</option>';
					for( var j in field.map ){
						if( j != "")
							option += '<option value="'+j+'">'+field.map[j]+'</option>';
					}
					div += '<span>&nbsp;'+field.name+'：</span>' + '<select name="'+field.id+'">'+option+'</select>';
				}
			}
			div += '<button type="button" class="btn query">查询</button>'+
				'<button type="reset" class="btn">重置</button>';
			div = $(div);
			//加入页面
			$('#'+defaultOption.id).append(div);
			//挂载事件
			$('#'+defaultOption.id).find('.query').click(function(){
				var data = {};
				for( var i in defaultOption.field ){
					var field = defaultOption.field[i];
					if( field.type == 'text'){
						data[field.id] = $.trim($('#'+defaultOption.id).find('input[name='+field.id+']').val());
					}else if( field.type == 'enum'){
						data[field.id] = $.trim($('#'+defaultOption.id).find('select[name='+field.id+']').val());
					}
				}
				defaultOption.submit(data);
			});
		},
		verticalInput:function( option ){
			//处理option
			var defaultOption = {
				id:'',
				field:[],
				value:{},
				submit:function(){
				},
				cancel:function(){
				}
			};
			for( var i in option )
				defaultOption[i] = option[i];
			
			//执行业务逻辑
			var div = "";
			var contentDiv = "";
			for( var i in defaultOption.field ){
				var field = defaultOption.field[i];
				contentDiv += 
					'<tr>'+
						'<td class="tableleft">'+field.name+'</td>';
				if( typeof field.targetId != 'undefined'){
					contentDiv += '<td id="'+field.targetId+'">';
				}else{
					contentDiv += '<td>';
				}
				if( field.type == 'read'){
					contentDiv += '<div name="'+field.id+'"/>';
				}else if( field.type == 'fullEditor'){
					field.editorTargetId = $.uniqueNum();
					contentDiv += '<div name="'+field.id+'" id="'+field.editorTargetId+'"/>';
				}else if( field.type == 'simpleEditor'){
					field.editorTargetId = $.uniqueNum();
					contentDiv += '<div name="'+field.id+'" id="'+field.editorTargetId+'"/>';
				}else if( field.type == 'image'){
					field.imageTargetId = $.uniqueNum();
					field.imageProgressTargetId = $.uniqueNum();
					contentDiv += '<div><img name="'+field.id+'" src=""/></div>'+
						'<div class="progress"><div class="bar" id="'+field.imageProgressTargetId+'"></div></div>'+
						'<div class="btn" id="'+field.imageTargetId+'"><span>点击这里上传图片</span></div>';
				}else if( field.type == 'area'){
					contentDiv += '<textarea name="'+field.id+'" style="width:90%;height:300px;"></textarea>';
				}else if( field.type == 'text'){
					contentDiv += '<input type="text" name="'+field.id+'"/>';
				}else if( field.type == 'password'){
					contentDiv += '<input type="password" name="'+field.id+'"/>';
				}else if( field.type == 'enum'){
					var option = "";
					for( var j in field.map ){
						option += '<option value="'+j+'">'+field.map[j]+'</option>';
					}
					contentDiv += '<select name="'+field.id+'">'+option+'</select>';
				}
				contentDiv +=
					'</td>'+
				'</tr>';
			}
			div += '<table class="table table-bordered table-hover definewidth m10">'+
				contentDiv+
				'<tr>'+
					'<td class="tableleft"></td>'+
					'<td>'+
						'<button type="button" class="btn btn-primary submit" >提交</button>'+
						'<button type="button" class="btn btn-success cancel">返回列表</button>'+
					'</td>'+
				'</tr>'+
			'</table>';
			div = $(div);
			//插入到页面中
			$('#'+defaultOption.id).append(div);
			//挂载控件事件
			for( var i in defaultOption.field ){
				var field = defaultOption.field[i];
				(function(field){
					if( field.type == 'image'){
						upload.image({
							url:field.url,
							target:field.imageTargetId,
							field:'data',
							width:2048,
							quality:0.8,
							onProgress:function(progress){
								$.console.log(progress);
								$('#'+field.imageProgressTargetId).text(progress+'%');
								$('#'+field.imageProgressTargetId).css('width',progress+'%');
							},
							onSuccess:function(data){
								data = $.JSON.parse(data);
								if( data.code != 0 ){
									dialog.message(data.msg);
									return;
								}
								div.find('img[name='+field.id+']').attr('src',data.data);
							},
							onFail:function(msg){
								dialog.message(msg);
							}
						});
					}else if( field.type == 'simpleEditor'){
						field._editor = editor.simpleEditor({
							id:field.editorTargetId
						});
					}else if( field.type == 'fullEditor'){
						field._editor = editor.fullEditor({
							id:field.editorTargetId
						});
					}
				})(field);
			}
			//设置value
			for( var i in defaultOption.field ){
				var field = defaultOption.field[i];
				if( typeof defaultOption.value[field.id] == 'undefined' )
					continue;
				if( field.type == 'read')
					div.find('div[name='+field.id+']').text(defaultOption.value[field.id]);
				else if( field.type == 'fullEditor')
					field._editor.setContent(defaultOption.value[field.id]);
				else if( field.type == 'simpleEditor')
					field._editor.setFormatData(defaultOption.value[field.id]);
				else if( field.type == 'image')
					div.find('img[name='+field.id+']').attr("src",defaultOption.value[field.id]);
				else if( field.type == 'area')
					div.find('textarea[name='+field.id+']').val(defaultOption.value[field.id]);
				else if( field.type == 'text' || field.type == 'password')
					div.find('input[name='+field.id+']').val(defaultOption.value[field.id]);
				else if( field.type == 'enum')
					div.find('select[name='+field.id+']').val(defaultOption.value[field.id]);
			}
			//挂载事件
			div.find('.submit').click(function(){
				var data = {};
				for( var i in defaultOption.field ){
					var field = defaultOption.field[i];
					if( field.type == 'read'){
						data[field.id] = $.trim($('#'+defaultOption.id).find('div[name='+field.id+']').text());
					}else if( field.type == 'simpleEditor'){
						data[field.id] = field._editor.getFormatData();
					}else if( field.type == 'fullEditor'){
						data[field.id] = field._editor.getContent();
					}else if( field.type == 'image'){
						data[field.id] = $.trim($('#'+defaultOption.id).find('img[name='+field.id+']').attr("src"));
					}else if( field.type == 'area'){
						data[field.id] = $.trim($('#'+defaultOption.id).find('textarea[name='+field.id+']').val());
					}else if( field.type == 'text' || field.type == 'password'){
						data[field.id] = $.trim($('#'+defaultOption.id).find('input[name='+field.id+']').val());
					}else if( field.type == 'enum'){
						data[field.id] = $.trim($('#'+defaultOption.id).find('select[name='+field.id+']').val());
					}
				}
				defaultOption.submit(data);
			});
			div.find('.cancel').click(defaultOption.cancel);
		}
	};
});
define('ui/query',['core/global','ui/table','ui/input'], function(require, exports, module){
	var $ = require('core/global');
	var dialog = require('ui/dialog');
	var table = require('ui/table');
	var input = require('ui/input');
	return {
		simpleQuery:function( option ){
			//处理option
			var defaultOption = {
				id:'',
				column:[],
				queryColumn:[],
				params:{},
				operate:[],
				checkAll:false,
				url:'',
				button:[],
			};
			for( var i in option )
				defaultOption[i] = option[i];
			//生成基本框架
			var formId = $.uniqueNum();
			var tableId = $.uniqueNum();
			var buttonListId = $.uniqueNum();
			var target = $('#'+defaultOption.id);
			var div = $(
			'<form id="'+formId+'" class="form-inline m10"></form>'+
			'<div class="m10"><div id="'+buttonListId+'"></div><div id="'+tableId+'"></div></div>');
			target.empty();
			target.append(div);
			//生成staticTable框架
			table.staticTable({
				id:tableId,
				params:defaultOption.params,
				column:defaultOption.column,
				operate:defaultOption.operate,
				checkAll:defaultOption.checkAll,
				url:defaultOption.url
			});
			//生成flowInput框架
			var field = [];
			for( var i in defaultOption.queryColumn ){
				var param = defaultOption.queryColumn[i];
				var columnInfo;
				for( var j in defaultOption.column ){
					var column = defaultOption.column[j];
					if( column.id == param ){
						columnInfo = column;
						break;
					}
				}
				if( columnInfo.type == 'enum'){
					columnInfo.map = $.extend({
						"":"请选择"
					},columnInfo.map);
				}
				field.push(columnInfo);
			}
			input.flowInput({
				id:formId,
				field:field,
				submit:function(data){
					table.staticTable({
						id:tableId,
						params:$.extend(defaultOption.params,data),
						column:defaultOption.column,
						operate:defaultOption.operate,
						checkAll:defaultOption.checkAll,
						url:defaultOption.url
					});
				}
			});
			//生成按钮框架
			for( var i in defaultOption.button ){
				var button = defaultOption.button[i];
				(function(button){
					var div = $('<button class="btn">'+
						button.name+'</button>');
					div.click(button.click);
					$('#'+buttonListId).append(div);
				})(button);
			}
			
		},
	};
});
define('ui/table',['core/global','ui/dialog','ui/gri/griTable'], function(require, exports, module){
	var $ = require('core/global');
	var dialog = require('ui/dialog');
	var GRI = require('ui/gri/griTable');
	return	{
		staticSimpleTable:function(option){
			//执行Option
			var defaultOption = {
				id:'',
				data:'',
				column:[],
				operate:[]
			};
			for( var i in option )
				defaultOption[i] = option[i];
			//显示数据
			function showData(data){
				var div = '';
				var operateDiv = '';
				div += '<div class="mod-basic">';
				div += '<table class="mod_table" style="table-layout: auto;">';
				//构造操作
				for( var i in defaultOption.operate ){
					defaultOption.operate[i].id = $.uniqueNum();
					operateDiv += "<a href='#' class=operate_"+defaultOption.operate[i].id
						+">"+defaultOption.operate[i].name+"</a>&nbsp;";
				}
				//显示列表头数据
				div += '<thead><tr>';
				for( var i in defaultOption.column ){
					var column = defaultOption.column[i];
					var style = '';
					if( column.type == 'hidden')
						style = 'style="display:none;"';
					div += '<th '+style+' ><span class="label">'+column.name+'</span></th>';
				}
				if( defaultOption.operate.length != 0 ){
					div += '<th><span class="label">操作</span></th>';
				}
				div += '</tr></thead>';
				//显示列表身数据
				div += '<tbody>';
				for( var i in data ){
					var item = data[i];
					div += '<tr>';
					for( var j in defaultOption.column ){
						var column = defaultOption.column[j];
						var style = '';
						if( column.type == 'hidden')
							style = 'style="display:none;"';
						div += '<td '+style+' class="'+column.id+'">'+item[column.id]+'</td>';
					}
					if( defaultOption.operate.length != 0 ){
						div += '<td>'+operateDiv+'</td>';
					}
					div += '</tr>';
				}
				div += '</tbody>';
				div += '</table>';
				div += '</div>';
				div = $(div);
				$('#'+defaultOption.id).append(div);
				//挂载事件
				for( var i in defaultOption.operate ){
					(function(i){
						$('.operate_'+defaultOption.operate[i].id).unbind("click").click(function(){
							var tr = $(this);
							while( tr.is('tr') == false )
								tr = tr.parent();
							var data = {};
							tr.find('td').each(function(){
								data[$(this).attr('class')] = $(this).text();
							});
							defaultOption.operate[i].click(data);
						});
					})(i);
				}
			}
			showData(defaultOption.data);
		},
		staticTable:function(option){
			//执行Option
			var defaultOption = {
				id:'',
				params:{},
				column:[],
				operate:[],
				checkAll:false,
				url:null,
			};
			for( var i in option )
				defaultOption[i] = option[i];
				
			//执行_option
			var sendUrl = '';
			var _option = {};
			_option.table_id    = defaultOption.id;
			_option.key_index   = '_id';
			_option.order_field = '_id';
			_option.order_type  = 'asc';
			_option.page_size   = 10;
			_option.container_class = "mod-basic box-table";
			_option.table_class = "mod_table";
			_option.fields      = '';
			_option.summary     = '';
			_option.ifRealPage  = true;
			_option.data        = 'data';
			_option.checkAll    = false;
			_option.params      = {};

			//拼接url
			var paramStr = "";
			for(var i in defaultOption.params) {
				if( $.trim(defaultOption.params[i]) != "")
					paramStr += (i+"="+encodeURIComponent($.trim(defaultOption.params[i])) + "&");
			}
			
			paramStr += ("t=" + new Date().getTime());
			sendUrl = defaultOption.url + "?" + paramStr;

			//拼接列
			_option.fields = {};
			for(var i in defaultOption.column){
				var column = defaultOption.column[i];
				var single;
				(function(column){
					if( column.type == 'text'){
						single = {
							thText:column.name
						};
					}else if( column.type == 'enum'){
						single = {
							thText:column.name,
							format:function(data){
								return column.map[data];
							}
						};
					}
				})(column);
				_option.fields[column.id] = single;
			}
			var info = "";
			for( var i in defaultOption.operate ){
				defaultOption.operate[i].id = $.uniqueNum();
				info += "<a href='#' class=operate_"+defaultOption.operate[i].id
					+">"+defaultOption.operate[i].name+"</a>&nbsp;";
			}
			if( defaultOption.operate.length != 0 ){
				_option.fields['_oper'] = {
					thText:'操作',
					format:function(){
						return info;
					}
				};
			}
			//GRITABLE
			$.get(sendUrl+"&pageIndex=0&pageSize=10", {}, function (result) {
				result = $.JSON.parse(result);
				if( result.code != 0 ){
					dialog.message(result.msg);
					return;
				}
				dt = GRI.initDataTable({
					resultObj: result,
					name: _option.data,
					tableId: _option.table_id,
					data: result.data[_option.data],
					summary: _option.summary,
					allFields: _option.fields,
					layout: 'auto',
					checkAll: _option.checkAll,
					enableThClick: true,  
					stopToday: false,
					keyIndex: _option.key_index,
					page:{
						orderField: _option.order_field,
						orderType: _option.order_type,
						ifRealPage: _option.ifRealPage,
						size: _option.page_size,
						rowCount: result.data.count,
						index: 0,
						url:sendUrl
					},
					cssSetting:{
						containerClass: _option.container_class,
						tableClass: _option.table_class
					},
					callback: function(data){
						for( var i in defaultOption.operate ){
							(function(i){
								$('.operate_'+defaultOption.operate[i].id).unbind("click").click(function(){
									var tr = $(this);
									while( tr.is('tr') == false )
										tr = tr.parent();
									var data = {};
									tr.find('td').each(function(){
										data[$(this).attr('class')] = $(this).text();
									});
									defaultOption.operate[i].click(data);
								});
							})(i);
						}
					}
				});
			});
		},
		
	};
});
define('ui/tree',['core/global'], function(require, exports, module){
	var $ = require('core/global');
	return {
		easyTree:function(option){
			//处理option
			var defaultOption = {
				id:'',
				data:[],
				button:[],
				value:null,
				click:function(){
				},
			};
			for( var i in option )
				defaultOption[i] = option[i];
			var div = "";
			div += '<div>';
			for( var i in defaultOption.button ){
				var button = defaultOption.button[i];
				button.id = $.uniqueNum();
				div += '<button class="btn btn-warn '+button.id+'">'+button.name+'</button>&nbsp;';
			}
			div += '</div>';
			div += '<div>';
			//基本框架
			function addSingleTree( tree ){
				var expandDiv = "";
				if( tree.children )
					expandDiv = '<span class="expand" style="font-size:16px;">&nbsp;-&nbsp;&nbsp;</span>';
				div += '<div class="item btn" data="'+tree.data+'" style="margin-top:10px;display:block;text-align:left;">'+
					expandDiv +
					'<span>'+tree.name+'</span>'+
				'</div>';
				if( tree.children ){
					div += '<div style="padding-left:30px;">';
					for( var i in tree.children ){
						addSingleTree(tree.children[i]);
					}
					div += '</div>';
				}
			}
			for( var i in defaultOption.data ){
				var item = defaultOption.data[i];
				addSingleTree(item);
			}
			div += '</div>';
			div = $(div);
			//加入页面
			$('#'+defaultOption.id).empty();
			$('#'+defaultOption.id).append(div);
			//挂载事件
			div.find('.item').click(function(){
				var data = $(this).attr('data');
				div.find('.btn').removeClass('btn-primary');
				$(this).addClass('btn-primary');
				defaultOption.click(data);
			});
			div.find('.expand').click(function(){
				var isExpand = ($(this).text().indexOf('+') != -1);
				var temp = $(this).parent().next();
				temp.slideToggle();
				if( isExpand )
					$(this).html('&nbsp;-&nbsp;&nbsp;');
				else
					$(this).html('&nbsp;+&nbsp;&nbsp;');
			});
			for( var i in defaultOption.button ){
				var button = defaultOption.button[i];
				(function(button){
					div.find('.'+button.id).click(function(){
						var data = div.find('.btn-primary').attr('data');
						button.click(data);
					});
				})(button);
			}
			//选择默认值
			if( defaultOption.value != null ){
				div.find('.item[data='+defaultOption.value+']').click();
			}
		}
	};
});