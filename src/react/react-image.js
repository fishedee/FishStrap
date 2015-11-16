module.exports =  React.createClass({
	propTypes: {
		requireSrc      : React.PropTypes.number,
		requireScale    : React.PropTypes.number,
    },
    updateImage:function(src){
    	var dom = $(this.getDOMNode());
		var scale = this.props.scale;
		var width = dom.width();
		var height = width*scale;
		dom.css('background','grey');
		dom.css('width',width);
		dom.css('height',height);
		dom.attr('src',src);
    },
	componentDidMount: function(){
		var self = this;
		setTimeout(function(){
			self.updateImage( self.props.src );
		},0);
	},
	componentWillReceiveProps:function(nextProps){
		if( this.props.src != nextProps.src )
			this.updateImage( nextProps.src );
	},
	render: function() {
		return React.createElement('img',{
			key:this.props.key,
			onClick:this.props.onClick,
			className:this.props.className,
			style:this.props.style
		});
	}
});