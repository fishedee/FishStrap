//插件与配置
fis.config.merge({
    modules : {
        postprocessor : {
            js : 'jswrapper'
        },
        postpackager : 'autoload'
    },
    settings : {
        postprocessor : {
            jswrapper : {
                type : 'amd',
            }
        }
    }
});
//压缩打包，减少HTTP请求
fis.config.set('pack', {
    'pkg/normal.js': [
		'fishstrap/lib/gri/gri.js',
        'fishstrap/core/global.js',
        'fishstrap/ui/dialog.js',
    ]
});
//目录规范
fis.config.merge({
    roadmap : {
        path : [
            {
                //fishstrap的lib目录下.js文件设置为非模块文件
                reg : /^\/fishstrap\/lib\/(.*)\.js$/i,
                isMod : false,
            },
			{
				//fishstrap的其它目录下js文件设置为模块文件
                reg : /^\/fishstrap\/(.*)\.(js)$/i,
                isMod : true,
			},
			{
                //Makefile文件，不要发布
                reg : /^\/Makefile$/i,
                release : false
            }
        ],
    },
});
//jquery的cdn
fis.config.get('roadmap.path').unshift({
	reg : /^\/fishstrap\/lib\/jquery.js$/i,
	useHash:false,
	isMod:false,
	release:'/libs/jquery/1.11.1/jquery.min.js'
});
fis.config.merge({
	roadmap: {
		domain:{
			'/fishstrap/lib/jquery.js':'http://apps.bdimg.com'
		}
	}
});
//underscore的cdn
fis.config.get('roadmap.path').unshift({
	reg : /^\/fishstrap\/lib\/underscore.js$/i,
	useHash:false,
	isMod:false,
	release:'/libs/underscore.js/1.7.0/underscore-min.js'
});
fis.config.merge({
	roadmap: {
		domain:{
			'/fishstrap/lib/underscore.js':'http://apps.bdimg.com'
		}
	}
});
console.log(fis.config.data.roadmap);
//如果要兼容低版本ie显示透明png图片，请使用pngquant作为图片压缩器，
//否则png图片透明部分在ie下会显示灰色背景
//使用spmx release命令时，添加--optimize或-o参数即可生效
//fis.config.set('settings.optimzier.png-compressor.type', 'pngquant');

//设置jshint插件要排除检查的文件，默认不检查lib、jquery、backbone、underscore等文件
//使用spmx release命令时，添加--lint或-l参数即可生效
//fis.config.set('settings.lint.jshint.ignored', [ 'lib/**', /jquery|backbone|underscore/i ]);

//csssprite处理时图片之间的边距，默认是3px
//fis.config.set('settings.spriter.csssprites.margin', 20);
