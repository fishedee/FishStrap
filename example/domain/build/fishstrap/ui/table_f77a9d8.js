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