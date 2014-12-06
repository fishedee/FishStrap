module.exports = function(grunt){
	var config = grunt.file.readJSON('package.json');
	var distDir = 'build/'+config.version+'/';
	grunt.initConfig({
		clean:{
			 build:{
				src:[distDir]
			 }
		},
		copy:{
			normal:{
				files:[
					{expand: true, cwd: 'src/', src: ['css/**','img/**','font/**'], dest: distDir}
				]
			},
			js:{
				files:[
					{expand: true, cwd: 'src/', src: ['js/**'], dest: distDir}
				]
			}
		},
		uglify:{
			build:{
				files:[
					{expand:true,cwd:'src',src:['js/**/*.js'],dest:distDir},
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
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default',['clean','copy']);
	grunt.registerTask('dist',['clean','copy:normal','uglify']);
	grunt.registerTask('live',['watch']);
};
