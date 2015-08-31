var LazyLoad = require('../util/jqueryLazyLoad.js');
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
		dom.attr('data-original',src);
		dom.attr('width',width);
		dom.attr('height',height);
		dom.lazyload({
			threshold : 200,
			effect : "fadeIn"
		});
    },
	componentDidMount: function(){
		this.updateImage( this.props.src );
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