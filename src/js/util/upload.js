define('util/upload',['core/global'], function(require, exports, module) {
	var $ = require('core/global');
	module.exports = {
		_checkFileSize:function( file , defaultOption , nextStep ){
			function checkMaxSize(size){
				if( size > defaultOption.maxSize ){
					if( defaultOption.maxSize < 1024 )
						defaultOption.onFail('上传文件必须少于'+defaultOption.maxSize+'Byte');
					else if( defaultOption.maxSize < 1024*1024 )
						defaultOption.onFail('上传文件必须少于'+(defaultOption.maxSize/1024)+'KB');
					else
						defaultOption.onFail('上传文件必须少于'+(defaultOption.maxSize/1024/1024)+'MB');
				}else{
					nextStep();
				}
			}
			if( file.files ){
				//支持HTML5的浏览器
				if( file.files[0].size )
					checkMaxSize(file.files[0].size);
				else
					checkMaxSize(file.files[0].fileSize);
			}else{
				if( defaultOption._fileName.match(/.jpg|.jpeg|.gif|.png|.bmp/i)){
					//如果是图像文件
					var imgObj =new Image();
					imgObj.onerror = function(){
						defaultOption.onFail('图像格式不正确');
					}
					//1s内仍然没有读取到图像大小则直接到下一步
					var intervalCount = 0;
					var interval = setInterval(function(){
						intervalCount++;
						if( imgObj.fileSize > 0 ){
							checkMaxSize(imgObj.fileSize);
							clearInterval(interval);
						}else if( intervalCount == 10 ){
							clearInterval(interval);
							nextStep();
						}
					},100);
					imgObj.src = defaultOption._fileAddress;
				}else{
					//如果不是图像文件，就放过它吧，旧式浏览器无法对非图像文件获取文件大小
					nextStep();
				}
			}
		},
		_checkFileSelect:function( file , defaultOption , nextStep ){
			if( file.files ){
				//支持HTML5的浏览器
				if( file.files.length == 0 )
					return;
				defaultOption._fileName = file.files[0].name;
				defaultOption._fileAddress = this.value;
			}else{
				//不支持HTML5的浏览器
				if( !file.value || file.value == null )
					return;
				defaultOption._fileName = file.value;
				//file.select();
				defaultOption._fileAddress = file.value ;
			}
			nextStep();
		},
		_checkFileType:function( file , defaultOption , nextStep ){
			//测试后缀来检查文件类型
			if( defaultOption.type && defaultOption.type != null ){
				var isAllow = false;
				var allowTypes = defaultOption.type.split('|');
				for( var i in allowTypes ){
					var allowType = $.trim(allowTypes[i]);
					if( allowType == "")
						continue;
					var allowType = '.'+allowType;
					if( defaultOption._fileName.substring( 
						defaultOption._fileName.length - allowType.length ) == allowType ){
						isAllow = true;
						break;
					}
				}
				if( !isAllow ){
					defaultOption.onFail('仅支持上传以下格式的文件：'+defaultOption.type);
					return;
				}
			}
			nextStep();
		},
		_iframeUpload:function(frameId,formId,defaultOption){
			//制作虚假的进度条，1000毫秒自动往上增加5%
			defaultOption._progress = 1;
			defaultOption._progressInterval = 0;
			defaultOption.onProgress(defaultOption._progress);
			defaultOption._progressInterval = setInterval(function(){
				if( defaultOption._progress + 5 >= 100 ){
					clearInterval(defaultOption._progressInterval);
					defaultOption._progressInterval = null;
					return;
				}
				defaultOption._progress += 5 ;
				defaultOption.onProgress(defaultOption._progress);
			},1000);
			//提交表单
			$('#'+formId).submit();
		},
		file:function( option ){
			var self = this;
			//初始化option
			var defaultOption = {
				url:'',
				target:'',
				filed:'',
				type:null,
				maxSize:null,
				accept:null,
				onProgress:function(data){
				},
				onSuccess:function(){
				},
				onFail:function(msg){
				},
			};
			for( var i in option ){
				defaultOption[i] = option[i];
			}
			//绘制图形
			var div = "";
			var formId = $.uniqueNum();
			var frameId = $.uniqueNum();
			var fileId = $.uniqueNum();
			if(defaultOption.accept)
				defaultOption.type = 'accept="'+defaultOption.accept+'"';
			div = '<form id="'+formId+'" action="'+defaultOption.url+'" target="'+frameId+'" method="post" enctype="multipart/form-data" style="opacity:0;display:block;position:absolute;top:0px;bottom:0px;left:0px;right:0px;width:100%;height:100%;z-index:9;overflow:hidden;">'+
				'<input type="file" id="'+fileId+'" style="width:100%;height:100%;font-size:1000px;" name="'+defaultOption.field+'"'+defaultOption.accept+'/>'+
				'<iframe name="'+frameId+'" id="'+frameId+'" style="display:none">'+
			'</form>';
			div = $(div);
			$('#'+defaultOption.target).css('position','relative');
			$('#'+defaultOption.target).append(div);
			
			//挂载iframe载入事件
			$('#'+frameId).load(function(){
				//iframe载入事件会触发两次，一次是空白页面，第二次是提交文件后的页面
				//检查progress是否存在就能区分这两种事件了。
				if(!defaultOption._progress)
					return;
				var result;
				if(this.contentWindow){
					result = $(this.contentWindow.document.body).html();
				}else{
					result = $(this.contentDocument.document.body).html();
				}
				clearInterval(defaultOption._progressInterval);
				defaultOption.onProgress(100);
				defaultOption.onSuccess(result);
			});
			//挂载上传事件操作
			div.find('input').on('change',function(){
				var file = this;
				self._checkFileSelect( file , defaultOption , function(){
					self._checkFileType( file , defaultOption , function(){
						self._checkFileSize( file , defaultOption , function(){
							self._iframeUpload(frameId,formId,defaultOption);
						});
					});
				});
			});
		}
	};
});