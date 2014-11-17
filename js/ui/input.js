define('ui/input',['lib/global','ui/dialog'], function(require, exports, module){
	var $ = require('lib/global');
	var dialog = require('ui/dialog');
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
					'<td class="tableleft">'+field.name+'</td>'+
					'<td>';
				if( field.type == 'read'){
					contentDiv += '<div name="'+field.id+'"/>';
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
			console.log(contentDiv);
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
			//设置value
			for( var i in defaultOption.field ){
				var field = defaultOption.field[i];
				if( typeof defaultOption.value[field.id] == 'undefined' )
					continue;
				if( field.type == 'read')
					div.find('div[name='+field.id+']').text(defaultOption.value[field.id]);
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
					}else if( field.type == 'text' || field.type == 'password'){
						data[field.id] = $.trim($('#'+defaultOption.id).find('input[name='+field.id+']').val());
					}else if( field.type == 'enum'){
						data[field.id] = $.trim($('#'+defaultOption.id).find('select[name='+field.id+']').val());
					}
				}
				defaultOption.submit(data);
			});
			div.find('.cancel').click(defaultOption.cancel);
			//插入到页面中
			$('#'+defaultOption.id).append(div);
		}
	};
});