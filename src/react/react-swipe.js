var Swipe = require('../module/swipe.js');

var styles = {
	container: {
		overflow: 'hidden',
		visibility: 'hidden',
		position: 'relative'
	},
	wrapper: {
		overflow: 'hidden',
		position: 'relative'
	},
	child: {
		float: 'left',
		width: '100%',
		position: 'relative'
	}
};

module.exports = React.createClass({
    // https://github.com/thebird/Swipe#config-options
    propTypes: {
		startSlide      : React.PropTypes.number,
		slideToIndex    : React.PropTypes.number,
		speed           : React.PropTypes.number,
		auto            : React.PropTypes.number,
		continuous      : React.PropTypes.bool,
		disableScroll   : React.PropTypes.bool,
		stopPropagation : React.PropTypes.bool,
		callback        : React.PropTypes.func,
		transitionEnd   : React.PropTypes.func
    },
    componentDidMount: function () {
		this.swipe = Swipe(React.findDOMNode(this), this.props);
    },
    componentDidUpdate: function (prevProps,propsState) {
    	if( prevProps.children.length != this.props.children.length ){
    		this.swipe.kill();
    		delete this.swipe;
    		this.swipe = Swipe(React.findDOMNode(this), this.props);
    	}
    },
    componentWillUnmount: function () {
      	this.swipe.kill();
      	delete this.swipe;
    },
    render: function() {
      	return React.createElement('div', React.__spread({}, this.props, {style: styles.container}),
        	React.createElement('div', {style: styles.wrapper},
          		React.Children.map(this.props.children, function (child,index) {
            		return React.cloneElement(child, {style: styles.child });
          		})
        	)
      );
    }
});