/*
*加载griTable
*@require ../lib/gri/griTable.js
*/
var $ = require('../core/global.js');
var dialog = require('./dialog.js');
module.exports = {
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
		//清除数据
		function clearAllData(){
			$('#'+defaultOption.id).find('tbody').empty();
		}
		//设置单行数据
		function setSingleData(tr,singleData){
			tr.find('td').each(function(){
				var singleColumn =  null;
				for( var j in defaultOption.column ){
					if( defaultOption.column[j].id == $(this).attr('class') ){
						singleColumn = defaultOption.column[j];
						break;
					}
				}
				if( singleColumn == null )
					return;
				if( singleColumn.type == 'hidden')
					$(this).text(singleData[singleColumn.id]);
				else if( singleColumn.type == 'image')
					$(this).find('img').attr('src',singleData[singleColumn.id]);
				else 
					$(this).text(singleData[singleColumn.id]);
			});
		}
		//获取单行数据
		function getSingleData(tr){
			var singleData = {};
			tr.find('td').each(function(){
				var singleColumn =  null;
				for( var j in defaultOption.column ){
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
			//挂载事件
			for( var i in defaultOption.operate ){
				(function(i){
					$('#'+defaultOption.id).find('.operate_'+defaultOption.operate[i].id).unbind("click").click(function(){
						var tr = $(this);
						while( tr.is('tr') == false )
							tr = tr.parent();
						var data = getSingleData(tr);
						var operation = {
							remove:function(){
								tr.remove();
							},
							mod:function(data){
								console.log(data);
								setSingleData(tr,data);
							},
						};
						defaultOption.operate[i].click(data,operation);
					});
				})(i);
			}
		}
		//添加数据
		function addData(data){
			//构造操作
			var operateDiv = '';
			for( var i in defaultOption.operate ){
				defaultOption.operate[i].id = $.uniqueNum();
				operateDiv += "<a href='javascript: void(0)' class=operate_"+defaultOption.operate[i].id
					+">"+defaultOption.operate[i].name+"</a>&nbsp;";
			}
			//构造添加数据
			var div = '';
			for( var i in data ){
				var item = data[i];
				div += '<tr>';
				for( var j in defaultOption.column ){
					var column = defaultOption.column[j];
					var style = '';
					var width = 'width:'+(1/defaultOption.column.length*100)+'%;';
					if( column.type == 'hidden'){
						div += '<td style="display:none;'+width+'" class="'+column.id+'">'+item[column.id]+'</td>';
					}else if( column.type == 'image'){
						div += '<td style="'+width+'" class="'+column.id+'"><img src="'+item[column.id]+'"/></td>';
					}else {
						div += '<td style="'+width+'" class="'+column.id+'">'+item[column.id]+'</td>';
					}
					
				}
				if( defaultOption.operate.length != 0 ){
					div += '<td>'+operateDiv+'</td>';
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
			for( var i in defaultOption.column ){
				var column = defaultOption.column[i];
				var style = '';
				var width = 'width:'+(1/defaultOption.column.length*100)+'%;';
				if( column.type == 'hidden'){
					div += '<th style="display:none;'+width+'"><span class="label">'+column.name+'</span></th>';
				}else {
					div += '<th style="'+width+'"><span class="label">'+column.name+'</span></th>';
				}
			}
			if( defaultOption.operate.length != 0 ){
				div += '<th><span class="label">操作</span></th>';
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
		showData(defaultOption.data);
		return {
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
		_option.checkAll    = defaultOption.checkAll;
		_option.params      = {};

		//拼接url
		var paramStr = "";
		for(var i in defaultOption.params) {
			if( $.trim(defaultOption.params[i]) != "")
				paramStr += (i+"="+encodeURIComponent($.trim(defaultOption.params[i])) + "&");
		}
		
		paramStr += ("t=" + new Date().getTime());
		if(defaultOption.url.indexOf('?') == -1 )
			sendUrl = defaultOption.url + "?" + paramStr;
		else
			sendUrl = defaultOption.url + "&" + paramStr;

		//拼接列
		_option.fields = {};
		for(var i in defaultOption.column){
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
		
		return {
			getCheckData:function(){
				var target = $('#'+defaultOption.id+' .gri_td_checkbox:checked');
				var data = [];
				target.each(function(){
					var parent = $(this).parent().parent();
					var singleData = {};
					parent.find('td').each(function(){
						singleData[$(this).attr('class')] = $(this).text();
					});
					data.push(singleData);
				});
				return data;
			}
		};
	},
	
};