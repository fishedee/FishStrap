var $ = require('../core/global.js');
var dialog = require('./dialog.js');
var editor = require('./editor.js');
var table = require('./table.js');
var upload = require('../util/upload.js');
var subPage = require('../page/subPage.js');
require('../util/jqueryDatetimePicker.js');
module.exports = {
	flowInput:function( option ){
		//处理option
		var defaultOption = {
			id:'',
			field:[],
			value:{},
			submit:function(){
			},
		};
		for( var i in option )
			defaultOption[i] = option[i];
		if( defaultOption.field.length == 0 )
			return;
		var div = "";
		//基本框架
		for( var i = 0 ; i != defaultOption.field.length; ++i ){
			var field = defaultOption.field[i];
			if( field.type == 'text'){
				div += '<span>&nbsp;'+field.name+'：</span>' + '<input type="text" name="'+field.id+'" class="input-small"/>';
			}else if(field.type == 'time'){
				div += '<span>&nbsp;'+field.name+'：</span>' + '<input type="text" name="'+field.id+'" class="time input-small"/>';
			}else if( field.type == 'enum' ){
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
		//挂载控件事件
		for( var i = 0 ; i != defaultOption.field.length ; ++i ){
			var field = defaultOption.field[i];
			if( field.type == 'time'){
				$('#'+defaultOption.id).find('input[name='+field.id+']').datetimepicker({
					lang:'ch',
					timepicker:false,
					format: 'Y-m-d H:i:s',
					closeOnDateSelect:true
				});
			}
		}
		//挂载默认值
		for( var i = 0 ; i != defaultOption.field.length ; ++i ){
			var field = defaultOption.field[i];
			var data = defaultOption.value[field.id];
			if( !data )
				continue;
			if( field.type == 'text'){
				$('#'+defaultOption.id).find('input[name='+field.id+']').val(data);
			}else if( field.type == 'time'){
				$('#'+defaultOption.id).find('input[name='+field.id+']').val(data);
			}else if( field.type == 'enum'){
				$('#'+defaultOption.id).find('select[name='+field.id+']').val(data);
			}
		}
		//挂载事件
		$('#'+defaultOption.id).find('.query').click(function(){
			var data = {};
			for( var i = 0 ; i != defaultOption.field.length; ++i ){
				var field = defaultOption.field[i];
				if( field.type == 'text'){
					data[field.id] = $.trim($('#'+defaultOption.id).find('input[name='+field.id+']').val());
				}else if( field.type == 'time'){
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
		$.console.log($.JSON.stringify(defaultOption.field));
		for( var i = 0; i != defaultOption.field.length; ++i ){
			var field = defaultOption.field[i];
			contentDiv +=
				'<tr>'+
					'<td class="tableleft" style="width:20%;">'+field.name+'</td>';
			if( typeof field.targetId != 'undefined'){
				contentDiv += '<td id="'+field.targetId+'">';
			}else{
				contentDiv += '<td>';
			}
			if( field.type == 'read'){
				contentDiv += '<div name="'+field.id+'"/>';
			}else if(field.type == 'time'){
				contentDiv += '<input type="text" name="'+field.id+'" class="time input-small"/>';
			}else if( field.type == 'link'){
				contentDiv += '<a name="'+field.id+'" target="_blank"><div name="'+field.id+'"/></a>';
			}else if( field.type == 'fullEditor'){
				field.editorTargetId = $.uniqueNum();
				contentDiv += '<div class="alert alert-danger" role="alert">注意！为了保证微信内观看视频的兼容性，强烈建议你只插入腾讯视频网址，不要插入其它视频网站，或直接上传视频。</div><div name="'+field.id+'" id="'+field.editorTargetId+'"/>';
			}else if( field.type == 'simpleEditor'){
				field.editorTargetId = $.uniqueNum();
				contentDiv += '<div name="'+field.id+'" id="'+field.editorTargetId+'"/>';
			}else if( field.type == 'image'){
				field.imageTargetId = $.uniqueNum();
				field.imageProgressTargetId = $.uniqueNum();
				contentDiv += '<div><img name="'+field.id+'" src=""/></div>'+
					'<div class="progress"><div class="bar" id="'+field.imageProgressTargetId+'"></div></div>'+
					'<div class="btn" id="'+field.imageTargetId+'"><span>点击这里上传图片</span></div>';
			}else if( field.type == 'file'){
				field.fileTargetId = $.uniqueNum();
				field.fileProgressTargetId = $.uniqueNum();
				contentDiv += '<div name="'+field.id+'"></div>'+
					'<div class="progress"><div class="bar" id="'+field.fileProgressTargetId+'"></div></div>'+
					'<div class="btn" id="'+field.fileTargetId+'"><span>点击这里上传文件</span></div>';
			}else if( field.type == 'compressFile'){
				field.tableId = $.uniqueNum();
				field.fileTargetId = $.uniqueNum();
				field.fileProgressTargetId = $.uniqueNum();
				contentDiv +=
					'<div id="'+field.tableId+'"></div>'+
					'<div class="progress"><div class="bar" id="'+field.fileProgressTargetId+'"></div></div>'+
					'<div class="btn" id="'+field.fileTargetId+'"><span>点击这里上传压缩文件</span></div>';
			}else if( field.type == 'area'){
				var disabledDiv = '';
				if( _.isUndefined(field.disabled) == false &&  field.disabled === true )
					disabledDiv = 'disabled="true"';
				contentDiv += '<textarea name="'+field.id+'" style="width:90%;height:300px;" '+disabledDiv+'></textarea>';
			}else if( field.type == 'text'){
				contentDiv += '<input type="text" name="'+field.id+'"/>';
			}else if( field.type == 'password'){
				contentDiv += '<input type="password" name="'+field.id+'"/>';
			}else if( field.type == 'enum'){
				var disabledDiv = '';
				if( _.isUndefined(field.disabled) == false &&  field.disabled === true )
					disabledDiv = 'disabled="true"';
				var option = "";
				for( var j in field.map ){
					option += '<option value="'+j+'">'+field.map[j]+'</option>';
				}
				contentDiv += '<select '+disabledDiv+' name="'+field.id+'">'+option+'</select>';
			}else if( field.type == 'check'){
				var disabledDiv = '';
				if( _.isUndefined(field.disabled) == false &&  field.disabled === true )
					disabledDiv = 'disabled="true"';
				var option = "";
				for( var j in field.map ){
					option += '<span><input type="checkbox" '+disabledDiv+' name="'+field.id+'" value="'+j+'">'+field.map[j]+'</span>&nbsp;&nbsp;';
				}
				contentDiv += option;
			}else if( field.type == 'table'){
				field.tableId = $.uniqueNum();
				contentDiv += '<div>';
				for( var j = 0 ; j != field.option.button.length ; ++j ){
					var singleButton = field.option.button[j];
					singleButton.buttonId = $.uniqueNum();
					contentDiv += '<button type="button" class="btn" id="'+singleButton.buttonId+'">'+singleButton.name+'</button>';
					field.option.button[j] = singleButton;
				}
				contentDiv += '</div>';
				contentDiv += '<div id="'+field.tableId+'"></div>';
			}
			contentDiv +=
				'</td>'+
			'</tr>';
		}
		var buttonDiv = '';
		if( _.isUndefined(defaultOption.submit) == false ||
			_.isUndefined(defaultOption.cancel) == false ){
			buttonDiv +=
			'<tr>'+
				'<td class="tableleft"></td>'+
				'<td>';
			if( _.isUndefined(defaultOption.submit) == false)
				buttonDiv += '<button type="button" class="btn btn-primary submit" >提交</button>';
			if( _.isUndefined(defaultOption.cancel) == false)
				buttonDiv += '<button type="button" class="btn btn-success cancel">返回列表</button>';
			buttonDiv +=
				'</td>'+
			'</tr>';
		}
		div += '<table class="table table-bordered table-hover definewidth m10">'+
			contentDiv+
			buttonDiv+
		'</table>';
		div = $(div);
		//插入到页面中
		$('#'+defaultOption.id).append(div);
		//挂载控件事件
		for( var i = 0 ; i != defaultOption.field.length; ++i ){
			var field = defaultOption.field[i];
			(function(field){
				if( field.type == 'image'){
					upload.image({
						url:field.option.url,
						urlToken:field.option.urlToken,
						urlType:field.option.urlType,
						target:field.imageTargetId,
						field:'data',
						width:field.option.width,
						height:field.option.height,
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
				}else if( field.type == 'file'){
					upload.file({
						url:field.option.url,
						target:field.fileTargetId,
						field:'data',
						type:field.option.type,
						maxSize:field.option.maxSize,
						onProgress:function(progress){
							$('#'+field.fileProgressTargetId).text(progress+'%');
							$('#'+field.fileProgressTargetId).css('width',progress+'%');
						},
						onSuccess:function(data){
							data = $.JSON.parse(data);
							if( data.code != 0 ){
								dialog.message(data.msg);
								return;
							}
							div.find('div[name='+field.id+']').text(data.data);
						},
						onFail:function(msg){
							dialog.message(msg);
						}
					});
				}else if( field.type == 'compressFile'){
					field.tableOperation = table.staticSimpleTable({
						id:field.tableId,
						data:[],
						column:[
							{id:'name',type:'html',name:'文件'}
						],
						operate:[]
					});
					upload.file({
						url:field.option.url,
						target:field.fileTargetId,
						field:'data',
						type:field.option.type,
						maxSize:field.option.maxSize,
						onProgress:function(progress){
							$.console.log(progress);
							$('#'+field.fileProgressTargetId).text(progress+'%');
							$('#'+field.fileProgressTargetId).css('width',progress+'%');
						},
						onSuccess:function(data){
							data = $.JSON.parse(data);
							if( data.code != 0 ){
								dialog.message(data.msg);
								return;
							}
							var fileAddress = _.map(data.data,function(single){
								return {name:'<a href="'+single+'" target="_blank">'+single+'</a>'};
							});
							field.tableOperation.clear();
							field.tableOperation.add(fileAddress);
						},
						onFail:function(msg){
							dialog.message(msg);
						}
					});
				}else if( field.type == 'simpleEditor'){
					field._editor = editor.simpleEditor({
						id:field.editorTargetId,
						url:field.option.url
					});
				}else if( field.type == 'fullEditor'){
					field._editor = editor.fullEditor({
						id:field.editorTargetId,
						url:field.option.url
					});
				}else if( field.type == 'time'){
					$('#'+defaultOption.id).find('input[name='+field.id+']').datetimepicker({
						lang:'ch',
						timepicker:false,
						format: 'Y-m-d H:i:s',
						closeOnDateSelect:true
					});
				}else if( field.type == 'table'){
					field.tableOperation = table.staticSimpleTable({
						id:field.tableId,
						data:[],
						column:field.option.column,
						operate:field.option.operate
					});
					for( var i = 0 ; i != field.option.button.length ; ++i ){
						var singleButton = field.option.button[i];
						$('#'+singleButton.buttonId).click(function(){
							singleButton.click(field.tableOperation);
						});
					}
				}
			})(field);
		}
		//设置value
		function setAllData(dataValue){
			for( var i = 0 ; i != defaultOption.field.length ; ++i ){
				var field = defaultOption.field[i];
				if( typeof dataValue[field.id] == 'undefined' )
					continue;
				if( field.type == 'read'){
					div.find('div[name='+field.id+']').text(dataValue[field.id]);
				}else if( field.type == 'link'){
					div.find('div[name='+field.id+']').text(dataValue[field.id]);
					div.find('a[name='+field.id+']').attr('href',dataValue[field.id]);
				}else if( field.type == 'fullEditor'){
					field._editor.setContent(dataValue[field.id]);
				}else if( field.type == 'simpleEditor'){
					field._editor.setFormatData(dataValue[field.id]);
				}else if( field.type == 'image'){
					div.find('img[name='+field.id+']').attr("src",dataValue[field.id]);
				}else if( field.type == 'file'){
					div.find('div[name='+field.id+']').text(dataValue[field.id]);
				}else if( field.type == 'compressFile'){
					var fileAddress = _.map(dataValue[field.id],function(single){
						return {name:'<a href="'+single+'" target="_blank">'+single+'</a>'};
					});
					field.tableOperation.clear();
					field.tableOperation.add(fileAddress);
				}else if( field.type == 'area'){
					div.find('textarea[name='+field.id+']').val(dataValue[field.id]);
				}else if( field.type == 'text' || field.type == 'password' || field.type == 'time'){
					div.find('input[name='+field.id+']').val(dataValue[field.id]);
				}else if( field.type == 'enum'){
					div.find('select[name='+field.id+']').val(dataValue[field.id]);
				}else if( field.type == 'check'){
					div.find('input[name='+field.id+']').each(function(){
						for( var i = 0 ; i != dataValue[field.id].length; ++i ){
							var value = dataValue[field.id][i];
							if( $(this).val() == value ){
								$(this).attr('checked',true);
								return;
							}
						}
						$(this).attr('checked',false);
					});
				}else if( field.type == 'table'){
					field.tableOperation.add(dataValue[field.id]);
				}
			}
		}
		//挂载事件
		function getAllData(){
			var data = {};
			for( var i = 0 ; i != defaultOption.field.length ; ++i ){
				var field = defaultOption.field[i];
				if( field.type == 'read'){
					data[field.id] = $.trim($('#'+defaultOption.id).find('div[name='+field.id+']').text());
				}else if( field.type == 'link'){
					data[field.id] = div.find('a[name='+field.id+']').attr('href');
				}else if( field.type == 'simpleEditor'){
					data[field.id] = field._editor.getFormatData();
				}else if( field.type == 'fullEditor'){
					data[field.id] = field._editor.getContent();
				}else if( field.type == 'image'){
					data[field.id] = $.trim($('#'+defaultOption.id).find('img[name='+field.id+']').attr("src"));
				}else if( field.type == 'file'){
					data[field.id] = $.trim($('#'+defaultOption.id).find('div[name='+field.id+']').text());
				}else if( field.type == 'compressFile'){
					data[field.id] = _.map(field.tableOperation.get(),function(single){
						return single.name;
					});
				}else if( field.type == 'area'){
					data[field.id] = $.trim($('#'+defaultOption.id).find('textarea[name='+field.id+']').val());
				}else if( field.type == 'text' || field.type == 'password' || field.type == 'time'){
					data[field.id] = $.trim($('#'+defaultOption.id).find('input[name='+field.id+']').val());
				}else if( field.type == 'enum'){
					data[field.id] = $.trim($('#'+defaultOption.id).find('select[name='+field.id+']').val());
				}else if( field.type == 'check'){
					data[field.id] = [];
					$('#'+defaultOption.id).find('input[name='+field.id+']:checked').each(function(){
						data[field.id].push($(this).val());
					});
				}else if( field.type == 'table'){
					data[field.id] = field.tableOperation.get();
				}
			}
			return data;
		}
		setAllData(defaultOption.value);
		div.find('.submit').click(function(){
			defaultOption.submit(getAllData());
		});
		div.find('.cancel').click(defaultOption.cancel);
		return {
			get:getAllData,
			set:setAllData
		};
	}
};
