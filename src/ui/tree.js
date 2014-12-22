var $ = require('../core/global.js');
module.exports = {
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