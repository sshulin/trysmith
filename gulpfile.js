const gulp = require('gulp'),
  rollup = require('rollup-stream'),
  babel = require('gulp-babel'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer');

gulp.task('copy-phaser', () =>
	gulp.src('./node_modules/phaser/build/phaser.min.js')
		.pipe(gulp.dest('build/js/vendor'))
		);

gulp.task('scripts', function() {
  return rollup({input: './src/js/game.js', format: 'iife'})
    .pipe(source('game.js'))
    .pipe(buffer())
    .pipe(babel({
      "presets": ["es2015"]
    }))
    .pipe(gulp.dest('build/js'));
});

gulp.task('assets', function() {
	gulp.src('./src/assets/**/*.*')
		.pipe(gulp.dest('build/assets'))	
})

gulp.task('page', function(){
	gulp.src('./src/index.html')
		.pipe(gulp.dest('build'))
})

gulp.task('default', ['copy-phaser', 'page', 'assets', 'scripts']);

gulp.task('watch', function(){
	gulp.watch('./src/js/**/*.js', ['scripts']);
})
