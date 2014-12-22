var $ = require('../core/global.js');
var jpegEncoder = require('./jpegEncoder.js');
module.exports = {
	isIosSubSample: function(b) {
		var a = b.naturalWidth,
			e = b.naturalHeight,
			d = false;
		if (a * e > 1024 * 1024) {
			var c = document.createElement("canvas");
			ctx = c.getContext("2d"), c.width = c.height = 1;
			ctx.drawImage(b, 1 - a, 0);
			d = ctx.getImageData(0, 0, 1, 1).data[3] === 0;
			c = ctx = null
		}
		return d;
	},
	getIosImageRatio: function(d, j, e) {
		var a = document.createElement("canvas"),
			k = a.getContext("2d"),
			c, g = 0,
			f = e,
			i = e;
		a.width = 1;
		a.height = e;
		k.drawImage(d, 1 - Math.ceil(Math.random() * j), 0);
		c = k.getImageData(0, 0, 1, e).data;
		while (i > g) {
			var b = c[(i - 1) * 4 + 3];
			if (b === 0) {
				f = i
			} else {
				g = i
			}
			i = (f + g) >> 1
		}
		return i / e;
	},
	drawImageIosFix:function (r, C, ux,uy,u, c, jx,jy,j, t) {
		if( this.isIosSubSample(C) ){
			u = u / 2;
			c = c / 2;
		}
		var b = document.createElement("canvas"),
			f = b.getContext("2d"),
			z = 1024,
			s = this.getIosImageRatio(C, u, c),
			p, o, q, B, k, i, l, v;
		b.width = b.height = z;
		o = 0;
		while (o < c) {
			B = o + z > c ? c - o : z, p = 0;
			while (p < u) {
				q = p + z > u ? u - p : z;
				f.clearRect(0, 0, z, z);
				f.drawImage(C, -p-ux, -o-uy);
				k = Math.floor(p * j / u);
				l = Math.ceil(q * j / u);
				i = Math.floor(o * t / c / s);
				v = Math.ceil(B * t / c / s);
				r.drawImage(b, 0, 0, q, B, k, i, l, v);
				p += z;
			}
			o += z;
		}
	},
	clipImage:function(r,x,y,width,height){
		var canvas = document.createElement("canvas"),
			context = canvas.getContext("2d");
		canvas.width = width;
		canvas.height = height;
		var imgData = r.getImageData(
			x,
			y,
			width,
			height
		);
		context.putImageData(imgData,0,0);
		return {
			canvas:canvas,
			context:context
		};
	},
	getImageBase64: function(C, n) {
		n = $.extend({
			maxW: 800,
			maxH: 800,
			quality: 0.8,
			scale:0,
			orien: 1
		}, n);
		var A = n.maxW,
			g = n.maxH,
			m = n.quality,
			u = C.naturalWidth,
			c = C.naturalHeight,
			ux = 0,
			uy = 0,
			scale = n.scale,
			j, t,
			isorien;
		//考虑倒转的问题
		if( n.orien >= 5 && n.orien <= 8 ){
			isorien = true;
		}else{
			isorien = false;
		}
		//放缩与切图
		if( scale && scale != 0 ){
			//含有固定宽高比的放缩
			if( isorien == false ){
				if(  u / c >= scale ){
					t = g;
					j = t * scale;
					ux = (u - scale*c)/2;
					uy = 0;
					u = scale*c;
					c = c;
				}else{
					j = A;
					t = j /scale;
					ux = 0;
					uy = (c-u/scale)/2;
					u = u;
					c = u/scale;
				}
			}else{
				if( c / u >= scale ){
					j = g;
					t = g*scale;
					ux = 0;
					uy = (c-u*scale)/2;
					u = u;
					c = u*scale;
				}else{
					t = A;
					j = A /scale;
					uy = 0;
					ux = (u-c/scale)/2;
					c = c;
					u = c/scale;
				}
			}
		}else{
			//不含固定宽高比的放缩
			if (u > A && u / c >= A / g) {
				j = A;
				t = c * A / u
			} else {
				if (c > g && c / u >= g / A) {
					j = u * g / c;
					t = g
				} else {
					j = u;
					t = c
				}
			}
		}
		//绘图
		var e = document.createElement("canvas"),
			r = e.getContext("2d"),
			a;
		this.doAutoRotate(e, j, t, n.orien);
		
		if ($.os.ios){
			this.drawImageIosFix(r,C, ux,uy,u, c, 0, 0, j, t);
		} else {
			r.drawImage(C, ux , uy, u, c, 0, 0, j, t)
		}
		//输出
		if ($.os.android) {
			var y = r.getImageData(0, 0, e.width, e.height);
				x = jpegEncoder.JPEGEncoder(m*100);
			a = jpegEncoder.encode(y);
			x = null
		} else {
			a = e.toDataURL("image/jpeg", m)
		}
		e = r = null;
		return a
	},
	doAutoRotate: function(d, e, a, c) {
		var b = d.getContext("2d");
		if (c >= 5 && c <= 8) {
			d.width = a;
			d.height = e;
		} else {
			d.width = e;
			d.height = a;
		}
		switch (c) {
		case 2:
			b.translate(e, 0);
			b.scale(-1, 1);
			break;
		case 3:
			b.translate(e, a);
			b.rotate(Math.PI);
			break;
		case 4:
			b.translate(0, a);
			b.scale(1, -1);
			break;
		case 5:
			b.rotate(0.5 * Math.PI);
			b.scale(1, -1);
			break;
		case 6:
			b.rotate(0.5 * Math.PI);
			b.translate(0, -a);
			break;
		case 7:
			b.rotate(0.5 * Math.PI);
			b.translate(e, -a);
			b.scale(-1, 1);
			break;
		case 8:
			b.rotate(-0.5 * Math.PI);
			b.translate(-e, 0);
			break;
		default:
			break
		}
	},
	getFileObjectURL: function(b) {
		var a = window.URL || window.webkitURL || false;
		if (a) {
			return a.createObjectURL(b)
		}
	},
	support: function() {
		return typeof(window.File) && typeof(window.FileList) && typeof(window.FileReader) && typeof(window.Blob)
	}
};