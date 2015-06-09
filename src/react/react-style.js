var styleSheetClass = {};
var styleSheetCounter = 0;
var prefixes = ["-ms-", "-moz-", "-webkit-", "-o-"];
var prefixesProperties = {
	'userSelect':'',
	'transform':'',
	'transition':'',
	'transformOrigin':'',
	'transformStyle':'',
	'transitionProperty':'',
	'transitionDuration':'',
	'transitionTimingFunction':'',
	'transitionDelay':'',
	'borderImage':'',
	'borderImageSlice':'',
	'boxShadow':'',
	'backgroundClip':'',
	'backfaceVisibility':'',
	'perspective':'',
	'perspectiveOrigin':'',
	'animation':'',
	'animationDuration':'',
	'animationName':'',
	'animationDelay':'',
	'animationDirection':'',
	'animationIterationCount':'',
	'animationTimingFunction':'',
	'animationPlayState':'',
	'animationFillMode':'',
	'appearance':'',
	'overflowScrolling':''
}

function transformSingleObjectToCss(value,originKey){
	var result = '';
	var key = originKey.replace(/[A-Z]+/g,function(word){
		return '-'+word.toLowerCase();
	});
	result += key + ':' + value + ';';
	if( prefixesProperties.hasOwnProperty(originKey) ){
		for( var j = 0 ;j != prefixes.length ; ++j ){
			result += prefixes[j] + key + ':' + value + ';';
		}
	}
	return result;
}
function transformObjectToCss(obj,namespace){
	var currentResult = '';
	var childrenResult = '';
	currentResult += namespace+'{';
	for( var i in obj ){
		if( typeof(obj[i]) != 'object' )
			currentResult += transformSingleObjectToCss(obj[i],i);
		else
			childrenResult += transformObjectToCss(obj[i],namespace+i);
	}
	currentResult += '}';
	return currentResult+childrenResult;
}
function hashCode(str){
	var hash = 0;
	if (str.length == 0) 
		return hash;
	for (i = 0; i < str.length; i++) {
		char = str.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}
function addCssToHead(str_css){
	try { 
		//IE下可行
		var style = document.createStyleSheet();
		style.cssText = str_css;
	}catch (e) { 
		//Firefox,Opera,Safari,Chrome下可行
		var style = document.createElement("style");
		style.type = "text/css";
		style.textContent = str_css;
		document.getElementsByTagName("HEAD").item(0).appendChild(style);
	}
}
function transformObjectToClass(obj){
	var stylesheetcode  = hashCode(JSON.stringify(obj));
	if( styleSheetClass[stylesheetcode] == undefined ){
		//原来没有的css
		var namespace = "s" + styleSheetCounter++;
		styleSheetClass[stylesheetcode] = namespace;
		addCssToHead(
			transformObjectToCss(obj,'.'+namespace)
		);
		return namespace;
	}else{
		//已有这个css
		return styleSheetClass[stylesheetcode];
	}
}
function extendDeep(leftObj,rightObj){
	for( var i in rightObj ){
		if( leftObj.hasOwnProperty(i) ){
			if( typeof(leftObj[i]) == 'object' && typeof(rightObj[i]) == 'object')
				leftObj[i] = extendDeep(leftObj[i],rightObj[i]);
			else
				leftObj[i] = rightObj[i];
		}else{
			leftObj[i] = rightObj[i];
		}
	}
	return leftObj;
}
var StyleSheet = {
	create:function(){
		var obj = {};
		for( var i = 0 ; i != arguments.length ; ++i ){
			obj = extendDeep(obj,arguments[i]);
		}
		var result = {};
		for( var i in obj ){
			result[i] = transformObjectToClass(obj[i]);
		}
		return result;
	}
};
module.exports = StyleSheet;
window.StyleSheet = StyleSheet;