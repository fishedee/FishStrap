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
        '/fishstrap/core/global.js',
        '/fishstrap/ui/dialog.js',
		'/fishstrap/ui/gri/gri.js',
    ]
});
//目录规范
fis.config.merge({
    roadmap : {
        path : [
			{
				//fishstrap目录下的jquery文件设置为百度cdn
				reg : /^\/fishstrap\/core\/jquery.nomod.js$/i,
				url:'/jquery/1.11.1/jquery.min.js',
				useHash:false,
			},
            {
                //fishstrap目录下.nomod.js文件设置为非模块文件
                reg : /^\/fishstrap\/(.*)\.nomod\.js$/i,
                isMod : false,
                id : 'fishstrap/$1',
				release: 'fishstrap/$1.js',
            },
			{
				//fishstrap目录下其它js文件设置为模块文件
                reg : /^\/fishstrap\/(.*)\.(js)$/i,
                isMod : true,
                id : 'fishstrap/$1',
				release: 'fishstrap/$1.js',
			},
			{
                //Makefile文件，不要发布
                reg : /\/Makefile$/i,
                release : false
            }
        ],
		domain:{
			'fishstrap/core/jquery.nomod.js':'http://libs.baidu.com'
		}
    },
	
});
//如果要兼容低版本ie显示透明png图片，请使用pngquant作为图片压缩器，
//否则png图片透明部分在ie下会显示灰色背景
//使用spmx release命令时，添加--optimize或-o参数即可生效
//fis.config.set('settings.optimzier.png-compressor.type', 'pngquant');

//设置jshint插件要排除检查的文件，默认不检查lib、jquery、backbone、underscore等文件
//使用spmx release命令时，添加--lint或-l参数即可生效
//fis.config.set('settings.lint.jshint.ignored', [ 'lib/**', /jquery|backbone|underscore/i ]);

//csssprite处理时图片之间的边距，默认是3px
//fis.config.set('settings.spriter.csssprites.margin', 20);
