var gulp = require('gulp');
var gutil = require('gulp-util');

var shell = require('gulp-shell');
var mocha = require('gulp-mocha');

gulp.task('build', function () {
	return gulp.src('.')
		.pipe(shell('clear'))
		.pipe(shell('node-gyp rebuild'))
		.on('error', gutil.log);
});

gulp.task('test', ['build'], function () {
	return gulp.src(['./test/**/*.spec.js'])
		.pipe(mocha())
		.on('error', gutil.log);
});

gulp.task('watch', function () {
	gulp.watch(['./bin/**/*.cpp'], ['build', 'test']);
	gulp.watch(['./test/**/*.spec.js'], ['test']);
});

gulp.task('default', ['watch']);