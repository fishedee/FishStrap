define('ui/ui',['ui/chart','ui/dialog','ui/editor','ui/input','ui/query','ui/table','ui/tree'], function(require, exports, module){
	return {
		'chart':require('ui/chart'),
		'dialog':require('ui/dialog'),
		'editor':require('ui/editor'),
		'input':require('ui/input'),
		'query':require('ui/query'),
		'table':require('ui/table'),
		'tree':require('ui/tree'),
	};
});