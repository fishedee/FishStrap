var uedit = require('../util/uedit.js');
var StyleSheet = require('react-style.js');
module.exports =  React.createClass({
	mixins: [React.addons.PureRenderMixin],
	getDefaultProps:function(){
		return {
			style:{},
			content:'',
			width:$(window).width()
		}
	},
	render: function() {
		var style = StyleSheet.create({
			root:{
				
			}
		},this.props.style);
		var content = uedit.parse(this.props.content,this.props.width);
		return React.createElement('div',{
			className:style.root,
			dangerouslySetInnerHTML:{
				__html:content
			}
		});
	}
});