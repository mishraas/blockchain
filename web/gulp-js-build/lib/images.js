'use strict';
module.exports = function(gulp, config) {
	gulp.task('images', function() {
		gulp.src(config.source.imagePaths)
		.pipe(gulp.dest(config.targetDir + '/' + config.imageDir));
	});
};