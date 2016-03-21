/*
*加载griTable
*@require ../lib/gri/griTable.js
*/
var $ = require('../core/global.js');
var dialog = require('./dialog.js');
module.exports = {
	staticSimpleTable:function(option){
		//$.console.log(option.column);
		//执行Option
		var defaultOption = {
			id:'',
			data:'',
			column:[],
			operate:[]
		};
		for( var i in option )
			defaultOption[i] = option[i];
		//清除数据
		function clearAllData(){
			$('#'+defaultOption.id).find('tbody').empty();
		}
		//设置单行数据
		function setSingleData(tr,singleData){
			tr.find('td').each(function(){
				var singleColumn =  null;
				for( var j = 0 ; j != defaultOption.column.length ; ++j ){
					if( defaultOption.column[j].id == $(this).attr('class') ){
						singleColumn = defaultOption.column[j];
						break;
					}
				}
				if( singleColumn == null )
					return;
				if( _.isUndefined(singleData[singleColumn.id]) == true )
					return;
				if( singleColumn.type == 'hidden')
					$(this).text(singleData[singleColumn.id]);
				else if( singleColumn.type == 'image')
					$(this).find('img').attr('src',singleData[singleColumn.id]);
				else if( singleColumn.type == 'textInput')
					$(this).find('input').val(singleData[singleColumn.id]);
				else 
					$(this).text(singleData[singleColumn.id]);
			});
		}
		//获取单行数据
		function getSingleData(tr){
			var singleData = {};
			tr.find('td').each(function(){
				var singleColumn =  null;
				for( var j = 0 ; j != defaultOption.column.length ; ++j ){
					if( defaultOption.column[j].id == $(this).attr('class') ){
						singleColumn = defaultOption.column[j];
						break;
					}
				}
				if( singleColumn == null )
					return;
				if( singleColumn.type == 'hidden')
					singleData[singleColumn.id] = $(this).text();
				else if( singleColumn.type == 'image')
					singleData[singleColumn.id] = $(this).find('img').attr('src');
				else if( singleColumn.type == 'textInput')
					singleData[singleColumn.id] = $(this).find('input').val();
				else 
					singleData[singleColumn.id] = $(this).text();
			});
			return singleData;
		}
		//获取数据
		function getAllData(){
			var data = [];
			$('#'+defaultOption.id).find('tbody tr').each(function(){
				var tr = $(this);
				while( tr.is('tr') == false )
					tr = tr.parent();
				data.push(getSingleData(tr));
			});
			return data;
		}
		//挂在事件
		function addEvent(){
			//设置触发方法
			var triggerEvent = function(tr,next){
				while( tr.is('tr') == false )
					tr = tr.parent();
				var data = getSingleData(tr);
				var operation = {
					remove:function(){
						tr.remove();
					},
					mod:function(data){
						setSingleData(tr,data);
					},
					moveUp:function(){
						var prev = tr.prev();
						tr.insertBefore(prev);
					},
					moveDown:function(){
						var next = tr.next();
						next.insertBefore(tr);
					}
				};
				next(data,operation);
			}
			//挂载operate事件
			for( var i  = 0 ; i != defaultOption.operate.length ; ++i ){
				(function(i){
					$('#'+defaultOption.id).find('.operate_'+defaultOption.operate[i].id).unbind("click").click(function(){
						triggerEvent($(this),defaultOption.operate[i].click);
					});
				})(i);
			}
			//挂载数据事件
			for( var i = 0 ; i != defaultOption.column.length; ++i ){
				(function(i){
					var column = defaultOption.column[i];
					if( column.type == 'textInput' && _.isUndefined(column.change) == false  ){
						$('#'+defaultOption.id).find('.'+column.id+' input').unbind("input").on('input',function(){
							triggerEvent($(this),column.change);
						});
					}
				})(i);
			}
		}
		//添加数据
		function addData(data){
			//构造操作
			var operateDiv = '';
			for( var i = 0 ; i != defaultOption.operate.length ; ++i ){
				defaultOption.operate[i].id = $.uniqueNum();
				operateDiv += "<a href='javascript: void(0)' class=operate_"+defaultOption.operate[i].id
					+">"+defaultOption.operate[i].name+"</a>&nbsp;";
			}
			//构造添加数据
			var div = '';
			for( var i = 0 ; i != data.length; ++i ){
				var item = data[i];
				if( defaultOption.operate.length == 0 )
					var width = 'width:'+(1/defaultOption.column.length*100)+'%;';
				else
					var width = 'width:'+(1/(defaultOption.column.length+1)*100)+'%;';
				div += '<tr>';
				for( var j = 0 ; j != defaultOption.column.length ; ++j ){
					var column = defaultOption.column[j];
					var style = '';
					if( column.type == 'hidden'){
						div += '<td style="display:none;'+width+'" class="'+column.id+'">'+item[column.id]+'</td>';
					}else if( column.type == 'image'){
						div += '<td style="'+width+'" class="'+column.id+'"><img src="'+item[column.id]+'"/></td>';
					}else if( column.type == 'textInput'){
						div += '<td style="'+width+'" class="'+column.id+'"><input style="width:100%" type="text" value="'+item[column.id]+'"/></td>';
					}else {
						div += '<td style="'+width+'" class="'+column.id+'">'+item[column.id]+'</td>';
					}
					
				}
				if( defaultOption.operate.length != 0 ){
					div += '<td style="'+width+'" >'+operateDiv+'</td>';
				}
				div += '</tr>';
			}
			return div;
		}
		//显示数据
		function showData(data){
			var div = '';
			div += '<div class="mod-basic">';
			div += '<table class="mod_table" style="table-layout: auto;">';
			//显示列表头数据
			div += '<thead><tr>';
			if( defaultOption.operate.length == 0 )
				var width = 'width:'+(1/defaultOption.column.length*100)+'%;';
			else
				var width = 'width:'+(1/(defaultOption.column.length+1)*100)+'%;';
			for( var i = 0; i != defaultOption.column.length ;++i ){
				var column = defaultOption.column[i];
				var style = '';
				if( column.type == 'hidden'){
					div += '<th style="display:none;'+width+'"><span class="label">'+column.name+'</span></th>';
				}else {
					div += '<th style="'+width+'"><span class="label">'+column.name+'</span></th>';
				}
			}
			if( defaultOption.operate.length != 0 ){
				div += '<th><span class="label" style="'+width+'">操作</span></th>';
			}
			div += '</tr></thead>';
			//显示列表身数据
			div += '<tbody>';
			div += addData(data);
			div += '</tbody>';
			div += '</table>';
			div += '</div>';
			div = $(div);
			$('#'+defaultOption.id).empty();
			$('#'+defaultOption.id).append(div);
			//挂载事件
			addEvent();
		}
		function addDataAndRefreshEvent(data){
			//添加数据
			$('#'+defaultOption.id).find('tbody').append(addData(data));
			//挂载事件
			addEvent();
		}
		function preaddDataAndRefreshEvent(data){
			//添加数据
			$('#'+defaultOption.id).find('tbody').prepend(addData(data));
			//挂载事件
			addEvent();
		}
		showData(defaultOption.data);
		return {
			preadd:preaddDataAndRefreshEvent,
			add:addDataAndRefreshEvent,
			get:getAllData,
			clear:clearAllData,
		};
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
			pageIndex:0,
			pageSize:10,
			nextPage:undefined
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
		_option.page_size   = defaultOption.pageSize;
		_option.index = Math.floor(defaultOption.pageIndex/defaultOption.pageSize);
		_option.container_class = "mod-basic box-table";
		_option.table_class = "mod_table";
		_option.fields      = '';
		_option.summary     = '';
		_option.ifRealPage  = true;
		_option.data        = 'data';
		_option.checkAll    = defaultOption.checkAll;
		_option.params      = {};

		//拼接url
		var paramStr = "";
		for(var i in defaultOption.params) {
			if( $.trim(defaultOption.params[i]) != "" &&
				i != 'pageIndex' &&
				i != 'pageSize')
				paramStr += (i+"="+encodeURIComponent($.trim(defaultOption.params[i])) + "&");
		}
		
		paramStr += ("t=" + new Date().getTime());
		if(defaultOption.url.indexOf('?') == -1 )
			sendUrl = defaultOption.url + "?" + paramStr;
		else
			sendUrl = defaultOption.url + "&" + paramStr;

		//拼接列
		_option.fields = {};
		for(var i = 0 ; i != defaultOption.column.length; ++i ){
			var column = defaultOption.column[i];
			if( column.hidden ){
				continue;
			}
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
				}else if( column.type == 'check' ){
					single = {
						thText:column.name,
						format:function(data){
							var result = [];
							for( var i = 0 ; i != data.length ; ++i ){
								result.push(column.map[data[i]]);
							}
							return result.join(',');
						}
					};
				}else if( column.type == 'image'){		
					single = {
						thText:column.name,		
						format:function(data){		
							return '<img src="'+data+'" style="width:100%;max-width:128px;">';		
						}		
					};		
 				}
			})(column);
			_option.fields[column.id] = single;
		}
		var info = "";
		for( var i = 0 ; i != defaultOption.operate.length; ++i ){
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
		$.get(sendUrl+"&pageIndex="+defaultOption.pageIndex+"&pageSize="+defaultOption.pageSize, {}, function (result) {
			result = $.JSON.parse(result);
			if( result.code != 0 ){
				dialog.message(result.msg);
				return;
			}
			var escapeDiv = $("<div/>");
 			var temp = result.data[_option.data];
 			for( var i in temp ){
 				var singleTemp = temp[i];
 				for( var j in singleTemp){
 					var singleTempData = singleTemp[j];
 					if( typeof singleTempData == 'string'){
 						singleTemp[j] = escapeDiv.text(singleTempData).html();
 					}
 				}
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
					index: _option.index,
					url:sendUrl
				},
				cssSetting:{
					containerClass: _option.container_class,
					tableClass: _option.table_class
				},
				callbackJson:defaultOption.nextPage,
				callback: function(data){
					for( var i = 0 ; i != defaultOption.operate.length; ++i ){
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
		function getSingleRowData(parent){
			var singleData = {};
			parent.find('td').each(function(){
				var id = $(this).attr('class');
				var column = null;
				for(var i = 0 ; i != defaultOption.column.length; ++i ){
					var curcolumn = defaultOption.column[i];
					if( curcolumn.id != id )
						continue;
					column = curcolumn;
					break;
				}
				if( column == null )
					return;
				var columnValue;
				if( column.type == 'image'){
					columnValue = $(this).find('img').attr('src');
				}else{
					columnValue = $(this).text();
				}
				singleData[id] = columnValue;
			});
			return singleData;
		}
		function exportData(type,title,url){
			var urlInfo = $.url.toInfo(url)
			//设置格式化数据
			var _viewFormat = {}
			for( var i in _option.fields ){
				_viewFormat[i] = _option.fields[i].thText
			}
			//导出
			var form = "";
			form += '<form action="'+urlInfo.originpathname+'" method="get" style="display:none">';
			for( i in urlInfo.search ){
				var key = i;
				var value = urlInfo.search[i];
				form += '<input type="text" name="'+key+'" class="input-small" value="'+encodeURIComponent(value)+'"/>';
			}
			form += '<input type="text" name="_viewTitle" class="input-small" value="'+encodeURIComponent(title)+'"/>';
			form += '<input type="text" name="_view" class="input-small" value="'+encodeURIComponent(type)+'"/>';
			form += '<input type="text" name="_viewFormat" class="input-small" value="'+encodeURIComponent(JSON.stringify(_viewFormat))+'"/>';
			form += '</form>';
			form = $(form);
			$('body').append(form);
			form.submit();
		}
		function exportDataAsync(type,title,pageIndex,pageSize){
			//设置格式化数据
			var _viewFormat = {}
			for( var i in _option.fields ){
				_viewFormat[i] = _option.fields[i].thText
			}
			//导出
			$.get('/export/'+type,{
				source:sendUrl,
				pageIndex:pageIndex,
				pageSize:pageSize,
				viewTitle:title,
				viewFormat:JSON.stringify(_viewFormat)
			},function(data){
				data = $.JSON.parse(data);
				if( data.code != 0 ){
					dialog.message(data.msg);
					return;
				}
				dialog.message("导出数据成功，请稍候留意邮箱！");
			})
		}
		return {
			getCheckData:function(){
				var target = $('#'+defaultOption.id+' .gri_td_checkbox:checked');
				var data = [];
				target.each(function(){
					var parent = $(this).parent().parent();
					data.push(getSingleRowData(parent));
				});
				return data;
			},
			exportDataToTxt:function(title){
				dialog.input('请输入需要导出txt的页数（不填代表导出本页数据）',function(pageSize){
					if( pageSize == '')
						pageSize = 1;
					pageSize = defaultOption.pageSize * pageSize;
					var url = sendUrl+"&pageIndex="+defaultOption.pageIndex+"&pageSize="+pageSize;
					exportData(
						'txt',
						title,
						url
					);
				});
			},
			exportDataToExcel:function(title){
				dialog.input('请输入需要导出excel的页数（不填代表导出本页数据）',function(pageSize){
					if( pageSize == '')
						pageSize = 1;
					pageSize = defaultOption.pageSize * pageSize;
					var url = sendUrl+"&pageIndex="+defaultOption.pageIndex+"&pageSize="+pageSize;
					exportData(
						'excel',
						title,
						url
					);
				});
			},
			exportDataToExcelAsync:function(title){
				dialog.input('请输入需要导出excel的页数（不填代表导出本页数据）',function(pageSize){
					if( pageSize == '')
						pageSize = 1;
					pageSize = defaultOption.pageSize * pageSize;
					exportDataAsync(
						'excel',
						title,
						defaultOption.pageIndex,
						pageSize
					);
				});
			},
		};
	},
	
};