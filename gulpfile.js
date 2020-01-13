

const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');

gulp.task('default', function(){
  return gulp.src('public/css/common/*.css')
    .pipe(cleanCSS({rebaseTo: 'public/css/build/'}))
    .pipe(concat('common.min.css'))
    .pipe(gulp.dest('public/css/build/'));
});