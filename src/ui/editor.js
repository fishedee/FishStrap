/*
*加载依赖的ueditor
*@require ../lib/uedit/ueditor.config.js
*@require ../lib/uedit/ueditor.all.min.js
*/
var $ = require('../core/global.js');
module.exports = {
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