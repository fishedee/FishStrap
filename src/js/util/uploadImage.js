define('util/uploadImage',['core/global','core/html5','util/imageCompresser','util/jpegMeta','util/jpegEncoder'], function(require, exports, module) {
	var $ = require('core/global');
	var imageCompresser = require('util/imageCompresser');
	var jpegMeta = require('util/jpegMeta').JpegMeta;
	var html5 = require('core/html5');
	module.exports = {
		upload:function( e,argv ){
			//初始化option
			var defaultOption = {
				url:"",
				file:null,
				maxWidth:0,
				maxHeight:0,
				quality:0.8,
				scale:0,
				block:0,
				onStart:function(){
				},
				onProgress:function(data){
				},
				onSuccess:function(){
				},
				onFail:function(msg){
				},
				onCancel:function(){
				},
				onStop:function(){
				}
			};
			for( var i in argv ){
				defaultOption[i] = argv[i];
			}
			defaultOption.block = Math.ceil(defaultOption.block/4)*4;
			//定义成员变量
			var self = {};
			self.onStart = defaultOption.onStart;
			self.onProgress = defaultOption.onProgress;
			self.onSuccess = defaultOption.onSuccess;
			self.onFail = defaultOption.onFail;
			self.onStop = defaultOption.onStop;
			self.onCancel = defaultOption.onCancel;
			self.file = defaultOption.file;
			self.fileData = null;
			self.uploadData = null;
			self.previewData = null;
			//定义成员函数
			self.readImage = function(successFun){
				var reader  = new FileReader();
				html5.fileReader.open({
					file:self.file,
					mode:'binary',
					onSuccess:function(data){
						self.fileData = data;
						successFun();
					},
					onFail:function(msg){
						self.onFail(msg);
						self.onStop();
					},
				});
			};
			self.compressImage = function( successFun ){
				var conf = {
					maxW: defaultOption.maxWidth,
					maxH: defaultOption.maxHeight,
					quality: defaultOption.quality,
					scale: defaultOption.scale
				};
				if (self.file.type == 'image/jpeg') {
					try {
						var jpg = new jpegMeta.JpegFile(self.fileData,self.file.name);
					} catch (e) {
					}
					if (jpg&&jpg.tiff && jpg.tiff.Orientation) {
						conf = $.extend(conf, {
							orien: jpg.tiff.Orientation.value
						});
					}
				}
				if( imageCompresser.support() == false ){
					self.onFail("浏览器不支持图片压缩");
					self.onStop();
				}
				var img = new Image();
				img.onload = function() {
					var uploadBase64;
					try {
						uploadBase64 = imageCompresser.getImageBase64(this, conf);
					} catch (e) {
						self.onFail('压缩图片失败 '+e);
						self.onStop();
						return false;
					}
					if (uploadBase64.indexOf('data:image') < 0) {
						self.onFail('上传照片格式不支持');
						self.onStop(id);
						return false;
					}
					self.uploadData = uploadBase64.split(';base64,')[1];
					self.previewData = uploadBase64;
					successFun();
				}
				img.onerror = function() {
					self.onFail('解析图片数据失败');
					self.onStop();
					return false;
				}
				img.src = imageCompresser.getFileObjectURL(self.file);
			};
			self.directUploadImage = function(){
				var formData = new FormData();
				formData.append('data', self.uploadData);
				var progress = function(e) {
					var percent = 30;
					if(e.lengthComputable){
						var percent = Math.ceil(100 * (e.loaded / e.total));
					}
					self.onProgress(percent);
				}
				var complete = function(e) {
					self.onSuccess(e.target.response);
					self.onStop();
				}
				var failed = function() {
					self.onFail('网络断开，请稍后重新操作');
					self.onStop()
				}
				var abort = function() {
					self.onFail('上传已取消');
					self.onStop()
				}
				var httpReuqest = new XMLHttpRequest();
				if( httpReuqest.upload ){
					httpReuqest.upload.addEventListener('progress',progress, false);
				}
				httpReuqest.addEventListener("load", complete, false);
				httpReuqest.addEventListener("abort", abort, false);
				httpReuqest.addEventListener("error", failed, false);
				httpReuqest.open("POST", defaultOption.url + '?t=' + Date.now(),true);
				httpReuqest.send(formData);
			},
			self.multiBlockUploadImage = function(){
				function singleBlockUploadImage(id,totalSize,beginSize,endSize){
					var formData = new FormData();
					formData.append('id', id);
					formData.append('totalSize', totalSize);
					formData.append('beginSize', beginSize);
					formData.append('endSize', endSize);
					formData.append('data', self.uploadData.substr(beginSize,endSize-beginSize));
					var complete = function(e) {
						if( endSize == totalSize ){
							self.onSuccess(e.target.response);
							self.onStop();
						}else{
							var progress = Math.ceil(100 * ( endSize/totalSize));
							var result = self.onProgress(progress,e.target.response);
							if( result == false ){
								self.onStop();
								return;
							}
							var remain = totalSize - endSize;
							if( remain > defaultOption.block)	
								singleBlockUploadImage(id,totalSize,endSize,endSize+defaultOption.block);
							else
								singleBlockUploadImage(id,totalSize,endSize,endSize+remain);
						}
					}
					var failed = function() {
						self.onFail('网络断开，请稍后重新操作');
						self.onStop();
					}
					var abort = function() {
						self.onFail('上传已取消');
						self.onStop();
					}
					var httpReuqest = new XMLHttpRequest();
					httpReuqest.addEventListener("load", complete, false);
					httpReuqest.addEventListener("abort", abort, false);
					httpReuqest.addEventListener("error", failed, false);
					httpReuqest.open("POST", defaultOption.url + '?t=' + Date.now(),true);
					httpReuqest.send(formData);
				}
				var id = $.base64.encode( new Date().toString() );
				for( var i = 0 ; i != 10 ; ++i )
					id = id +''+Math.ceil(Math.random()*10);
				var totalSize = self.uploadData.length;
				var beginSize = 0;
				var endSize = defaultOption.block < totalSize ? defaultOption.block :totalSize;
				singleBlockUploadImage(id,totalSize,beginSize,endSize);
			},
			self.uploadImage = function(){
				if( defaultOption.block > 0 )
					self.multiBlockUploadImage();
				else
					self.directUploadImage();
			};
			self.getPreviewImage = function(){
				return self.previewData;
			};
			//定义主流程
			self.onStart();
			e = e || window.event;
			var support = this.isSupport();
			if( support.code != 0 ){
				self.onFail(support.msg);
				self.onStop();
				return;
			}
			var fileList = e.target.files;
			if (!fileList.length) {
				self.onCancel();
				self.onStop();
				return;
			}
			self.file = fileList[0];
			self.onProgress(0);
			self.readImage(function(){
				self.compressImage(function(){
					self.uploadImage();
				});
			});
			return self;
		},
		isSupport:function() {
			if ($.os.android) {
                var MQQBrowser = navigator.userAgent.match(/MQQBrowser\/([^\s]+)/);
                if (!MQQBrowser || MQQBrowser && MQQBrowser[1] < '5.2') {
                    if ($.os.version.toString().indexOf('4.4') === 0 || $.os.version.toString() <= '2.1') {
						return {
							code:1,
							msg:'您的手机系统暂不支持传图',
						};
                    }
                }
            } else if ($.os.ios && $.os.version.toString() < '6.0') {
				return {
					code:1,
					msg:'手机系统不支持传图，请升级到ios6.0以上',
				};
            }
            if ($.os.wx && $.os.wxVersion.toString() < '5.2') {
				return {
					code:1,
					msg:'当前微信版本不支持传图，请升级到最新版',
				};
            }
            return {
				code:0,
				msg:''
			};
		}
	};
});