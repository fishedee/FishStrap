var style = StyleSheet.create({
	root:{
		position:'relative',
		overflow:'hidden',
	},
	content:{

	},
	placeholder:{
		position:'absolute',
		display:'none',
		left:'0px',
		right:'0px',
		top:'0px',
		fontSize:'16px',
		color:'grey',
	}
});

module.exports =  React.createClass({
	mixins: [React.addons.PureRenderMixin],
	getDefaultProps:function(){
	},
    _selection:function(node){
    	document.getSelection().removeAllRanges();
        var range = document.createRange();
        range.setStart(node[0], 0);
        range.collapse(true);
        document.getSelection().addRange(range);
    },
	_setEmptyHtml:function(){
		var emptyP = $('<p><br/></p>');
		this._inputElement.html(emptyP);
		this._selection( this._inputElement.find('p') );
	},
	_checkPlaceHolder:function(){
		var self = this;
		var text = self._inputElement.text();
		var hasImage = self._inputElement.find("img").length > 0;
		if( hasImage == false && text == '' )
			self._placeholderElement.show();
		else
			self._placeholderElement.hide();
	},
	_initEvent:function(){
		var self = this;
		self._inputElement.on('input',function(e){
			self._checkPlaceHolder();
			if ( self._inputElement.html() == '') {
				self._setEmptyHtml();
				e.preventDefault();
			}
			if( self.props.onChange ){
				self.props.onChange(self._inputElement.html());
			}
		});
	},
	_initProps:function( props ){
		//设置html
		if( props.value != this._inputElement.html() ){
			this._inputElement.html( props.value );
		}
		if( this._inputElement.html() == '' ){
			this._setEmptyHtml();
		}
		//设置placeholder
		this._placeholderElement.text( this.props.placeholder );
		//check placeholder
		this._checkPlaceHolder();
	},
	bold:function(){
		document.execCommand("bold","false",null);
	},
	insertHtml:function(html){
		document.execCommand("insertHtml","false",html);
	},
	insertImage:function(src){
		document.execCommand("insertImage","false",src);
	},
	insertImageWithNewParagraph:function(src){
		var image = $('<p><img src="'+src+'" style="max-width:80%;"></p>');
		this._inputElement.append(image); 
		if( this.props.onChange ){
			this.props.onChange(this._inputElement.html());
		}
	},
	componentDidMount:function(){
		this._inputElement = $(React.findDOMNode(this.refs.input));
		this._placeholderElement = $(React.findDOMNode(this.refs.placeholder));
		this._initProps( this.props );
		this._initEvent();
	},
	componentWillReceiveProps:function(nextProps){
		this._initProps( nextProps );
	},
	render: function() {
		return React.createElement(
			'div',
			{className:CX(style.root,this.props.className),style:this.props.style},
			React.createElement(
				'div',
				{className:style.content,ref:'input',autoFocus:'true',contentEditable:'true'}
			),
			React.createElement(
				'div',
				{className:style.placeholder,ref:'placeholder'}
			)
		);
	}
});