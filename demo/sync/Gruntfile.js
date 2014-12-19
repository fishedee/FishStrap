module.exports = function(grunt){
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
		exec:{
			default:'rm build -rf && cd src && rm fishstrap* -rf && cp ../../../src fishstrap -r  && fis release --md5 --dest ../build && rm fishstrap -rf',
			dist:'fis release --md5 --dest -o ../build',
		},
		watch:{
			build:{
				files:['../../src/**','src/*.html'],
				tasks:['default'],
				options:{
					spawn:false,
					livereload:true,
				}
			}
		},
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-exec');
	grunt.registerTask('default',['exec:default']);
	grunt.registerTask('dist',['exec:dist']);
	grunt.registerTask('live',['watch']);
};
