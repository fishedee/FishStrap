var Swiper = require('../module/swiper.js');

var width = $(window).width();
if( width >= 600 )
  width = 600
var styles = StyleSheet.create({
	container: {
    width: '100%',
    height: '100%',
		margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
    /* Fix of Webkit flickering */
    zIndex: '1',

    '> .swiper-wrapper': {
      position: 'relative',
      width: '100%',
      height: '100%',
      zIndex: '1',

      display:[
        '-webkit-box',
        '-moz-box',
        '-ms-flexbox',
        '-webkit-flex',
        'flex'
      ],
      WebkitTransitionProperty: '-webkit-transform',
      MozTransitionProperty: '-moz-transform',
      OTransitionProperty: '-o-transform',
      MsTransitionProperty: '-ms-transform',
      transitionProperty: 'transform',
      WebkitBoxSizing: 'content-box',
      MozBoxSizing: 'content-box',
      boxSizing: 'content-box',

      '> .swiper-slide':{
        fontSize:'0',
        textAlign: 'center',
        width: width +'px',
        //width: '100%',
        //height: '100%',
        position: 'relative',

        WebkitFlexShrink: '0',
        MsFlex: '0 0 auto',
        flexShrink: '0',

        display:[
          '-webkit-flex',
          '-webkit-box',
          '-ms-flexbox',
          'flex'
        ],
        WebkitBoxPack: 'center',
        MsFlexPack: 'center',
        WebkitJustifyContent: 'center',
        justifyContent: 'center',
        WebkitBoxAlign: 'center',
        MsFlexAlign: 'center',
        WebkitAlignItems: 'center',
        alignItems: 'center',
      },
    },
    '> .swiper-pagination':{
      position: 'absolute',
      zIndex:'2',
      left:'0',
      right:'15px',
      margin:'8.5px auto',
      bottom:'0',
      textAlign: 'right',
      padding:'0',

      WebkitTransition: '300ms',
      MozTransition: '300ms',
      OTransition: '300ms',
      transition: '300ms',
      WebkitTransform: 'translate3d(0, 0, 0)',
      MsTransform: 'translate3d(0, 0, 0)',
      OTransform: 'translate3d(0, 0, 0)',
      transform: 'translate3d(0, 0, 0)',

      ' > .swiper-pagination-bullet': {
        display: 'inline-block',
        marginBottom:'2px',
        marginLeft: '5px',
        backgroundColor:'#F0F0F0',
        borderRadius: '100%',
        height: '7px',
        width: '7px',
        position:'relative',

        ':first-child':{
          marginLeft:'0'
        },
      },

      ' > .swiper-pagination-bullet-active':{
        backgroundColor:'#F95050'
      }
    }
	}
});

module.exports = React.createClass({
    // https://github.com/thebird/Swipe#config-options
    propTypes: {
      initialSlide          : React.PropTypes.number,
      speed                 : React.PropTypes.number,
      autoplay              : React.PropTypes.number,
    },
    componentDidMount: function () {
      this.swiper = new Swiper('.'+styles.container, $.extend({
        paginationClickable:true,
        pagination:'.swiper-pagination'
      },this.props));
    },
    componentDidUpdate: function (prevProps,propsState) {
    	if( prevProps.children.size != this.props.children.size ){
        this.swiper = new Swiper('.'+styles.container, $.extend({
          paginationClickable:true,
          pagination:'.swiper-pagination'
        },this.props));
    	}
    },
    render: function() {
      	return React.createElement('div', {className:CX(styles.container,this.props.className)},
        	React.createElement('div', {className:'swiper-wrapper'},
          		React.Children.map(this.props.children, function (child,index) {
            		return React.cloneElement(child, {className:'swiper-slide'});
          		})
        	),
          React.createElement('div',{className:'swiper-pagination'},null)
      );
    }
});