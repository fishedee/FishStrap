var $ = require('../core/global.js');
var dialog = require('./dialog.js');
var table = require('./table.js');
var input = require('./input.js');
module.exports = {
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
		$.console.log($.JSON.stringify(option.column));
		//生成staticTable框架
		var tableOperation = table.staticTable({
			id:tableId,
			params:defaultOption.params,
			column:defaultOption.column,
			operate:defaultOption.operate,
			checkAll:defaultOption.checkAll,
			url:defaultOption.url
		});
		//生成flowInput框架
		var field = [];
		for( var i = 0 ; i != defaultOption.queryColumn.length; ++i ){
			var param = defaultOption.queryColumn[i];
			var columnInfo;
			for( var j = 0 ; j != defaultOption.column.length ; ++j ){
				var column = defaultOption.column[j];
				if( column.id == param ){
					columnInfo = _.clone(column);
					break;
				}
			}
			if( columnInfo.type == 'enum'){
				columnInfo.map = $.extend({
					"":"请选择"
				},columnInfo.map);
			}else if( columnInfo.type == 'check'){
				columnInfo.type = 'enum';
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
		for( var i = 0 ; i != defaultOption.button.length ; ++i ){
			var button = defaultOption.button[i];
			(function(button){
				var div = $('<button class="btn">'+
					button.name+'</button>');
				div.click(button.click);
				$('#'+buttonListId).append(div);
			})(button);
		}
		return tableOperation;
	},
};