function buildHtml(labelName,labelArgv){
	var result = '<'+labelName;
	for( var i in labelArgv ){
		result += ' ' + i + '="' + labelArgv[i] +'"';
	}
	result += '></'+labelName+'>';
	return result;
}
function buildStyle(styleArgv){
	var result = '';
	for( var i in styleArgv ){
		result += ' ' + i + ':' + styleArgv[i] +';';
	}
	return result;
}
function replaceQQVideo2(content,articleWith){
	var qqVideoRegex = /<embed.*?src="http:\/\/v.qq.com\/.*?\/([^\/]*?)\.html".*?width="(.*?)".*?height="(.*?)".*?\/>/img;
	var qqVideoWidth = articleWith;
	var qqVideoHeight = Math.ceil(qqVideoWidth /1.5);
	var qqVideoSrc = 'http://v.qq.com/iframe/player.html?vid=$1&width='+qqVideoWidth+'&height='+qqVideoHeight+'&auto=0';
	var qqVideoStyle = buildStyle({
		'z-index':'1',
		'height':qqVideoHeight+'px !important',
		'width':qqVideoWidth+'px !important',
		'overflow':'hidden'
	});
	var qqVideoReplace = buildHtml(
		'iframe',
		{
			'class':'video_iframe',
			'style':qqVideoStyle,
			'height':qqVideoHeight+'px',
			'width':qqVideoWidth+'px',
			'frameborder':'0',
			'data-src':qqVideoSrc,
			'src':qqVideoSrc,
			'allowfullscreen':'',
			'scrolling':'no'
		}
	);
	content = content.replace(qqVideoRegex,qqVideoReplace);
	return content;
}
function replaceQQVideo(content,articleWith){
	var qqVideoRegex = /<embed.*?src="http:\/\/static.video.qq.com\/TPout.swf\?vid=(.*?)".*?width="(.*?)".*?height="(.*?)".*?\/>/img;
	var qqVideoWidth = articleWith;
	var qqVideoHeight = Math.ceil(qqVideoWidth /1.5);
	var qqVideoSrc = 'http://v.qq.com/iframe/player.html?vid=$1&width='+qqVideoWidth+'&height='+qqVideoHeight+'&auto=0';
	var qqVideoStyle = buildStyle({
		'z-index':'1',
		'height':qqVideoHeight+'px !important',
		'width':qqVideoWidth+'px !important',
		'overflow':'hidden'
	});
	var qqVideoReplace = buildHtml(
		'iframe',
		{
			'class':'video_iframe',
			'style':qqVideoStyle,
			'height':qqVideoHeight+'px',
			'width':qqVideoWidth+'px',
			'frameborder':'0',
			'data-src':qqVideoSrc,
			'src':qqVideoSrc,
			'allowfullscreen':'',
			'scrolling':'no'
		}
	);
	content = content.replace(qqVideoRegex,qqVideoReplace);
	return content;
}
function replaceImage(content,articleWith){
	var imageRegex = /<img(.*?)\/?>/ig;
	var imageReplace = '<img $1 style="width:'+articleWith+'px"/>';
	content = content.replace(imageRegex,imageReplace);
	return content;
}
module.exports = {
	parse:function(content,articleWith){

		content = replaceQQVideo(content,articleWith);

		content = replaceQQVideo2(content,articleWith);

		content = replaceImage(content,articleWith);
		
		return content;
	}
}