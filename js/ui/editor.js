define('ui/editor',['lib/global'],function(require, exports, module){
	var $ = require('lib/global');
	return {
		simpleEditor:function(option){
			//处理option
			var defaultOption =	{
				id:'',
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
					console.log(data);
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