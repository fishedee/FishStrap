module.exports = function(grunt){
	grunt.initConfig({
		config:grunt.file.readJSON('package.json'),
		clean:{
			 build:{
				src:['build']
			 }
		},
		copy:{
			normal:{
				files:[
					{expand: true, cwd: 'src/', src: ['css/**','img/**','font/**'], dest: 'build/fishstrap'}
				]
			},
			js:{
				files:[
					{expand: true, cwd: 'src/', src: ['js/**','!js/util/upload.js','!js/util/jpegEncoder.js','!js/util/jpegMeta.js','!js/util/imageCompresser.js'], dest: 'build/fishstrap'}
				]
			}
		},
		concat:{
			upload:{
				src:['src/js/util/upload.js','src/js/util/jpegEncoder.js','src/js/util/jpegMeta.js','src/js/util/imageCompresser.js'],
				dest:'build/fishstrap/js/util/upload.js'
			}
		},
		uglify:{
			build:{
				files:[
					{expand:true,cwd:'build',src:['js/**/*.js'],dest:'build'},
				]
			}
		},
		watch:{
			build:{
				files:'src/**',
				tasks:['default'],
				options:{
					spawn:false,
				}
			}
		},
	});
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default',['clean','copy','concat']);
	grunt.registerTask('dist',['default','uglify']);
	grunt.registerTask('live',['watch']);
};