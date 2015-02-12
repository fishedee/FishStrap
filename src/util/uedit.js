function replaceQQVideo(content,articleWith){
	var qqVideoRegex = /<embed.*?src="http:\/\/static.video.qq.com\/TPout.swf\?vid=(.*?)".*?width="(.*?)".*?height="(.*?)".*?\/>/img;
	var qqVideoWidth = articleWith;
	var qqVideoHeight = Math.ceil(qqVideoWidth /1.5);
	var qqVideoReplace = '<iframe class="video_iframe" style="position:relative; z-index:1;" height="'+qqVideoHeight+'px" width="'+qqVideoWidth+'px" frameborder="0" src="http://v.qq.com/iframe/player.html?vid=$1&width='+qqVideoWidth+'&height='+qqVideoHeight+'&auto=0" allowfullscreen=""></iframe>';
	content = content.replace(qqVideoRegex,qqVideoReplace);
	return content;
}
function replaceImage(content,articleWith){
	var imageRegex = /<img(.*?)\/>/ig;
	var imageReplace = '<img $1 style="width:'+articleWith+'px"/>';
	content = content.replace(imageRegex,imageReplace);
	return content;
}
module.exports = {
	parse:function(content,articleWith){

		content = replaceQQVideo(content,articleWith);

		content = replaceImage(content,articleWith);
		
		return content;
	}
}