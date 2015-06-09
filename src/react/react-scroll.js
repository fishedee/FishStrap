var StyleSheet = require('react-style.js');
module.exports =  React.createClass({
	getDefaultProps:function(){
		return {
			scrollX:true,
			scrollY:true,
			scrollLeft:0,
			scrollTop:0,
		}
	},
	componentDidMount:function(){
		var self = this;
		var domNode = $(this.getDOMNode());
		domNode.scrollTop(this.props.scrollTop);
		domNode.scrollLeft(this.props.scrollLeft);
		domNode.scroll(function(){
			var scrollTop = domNode.scrollTop();
			var scrollLeft = domNode.scrollLeft();
			if( self.props.onScroll )
				self.props.onScroll(scrollLeft,scrollTop);
		});
	},
	render: function() {
		var newStyle = {};
		if( this.props.scrollX && this.props.scrollY ){
			newStyle = {
				overflow:'auto'
			};
		}else if( this.props.scrollX && !this.props.scrollY  ){
			newStyle = {
				overflowX:'auto',
				overflowY:'hidden'
			};
		}else if( !this.props.scrollX && this.props.scrollY  ){
			newStyle = {
				overflowX:'hidden',
				overflowY:'auto'
			};
		}else{
			newStyle = {
				overflow:'hidden'
			};
		}
		var style = StyleSheet.create({
			root:{
				overflowScrolling:'touch',
				flex:'1'
			}
		},{
			root:newStyle
		});
		return React.createElement('div',{
			className:style.root
		},this.props.children);
	}
});