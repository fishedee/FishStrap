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
		dom.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC');
		dom.attr('width',width);
		dom.attr('height',height);
		var img = new Image();  
	    img.onload = function(){
	    	dom.attr('src',src);
	    };
	    img.src = src;
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