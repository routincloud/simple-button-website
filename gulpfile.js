const gulp = require('gulp');
const concat = require('gulp-concat');

gulp.task('css', function() {
  return gulp.src(['./assets/css/*.css'])
    .pipe(concat('stl.css'))
    .pipe(gulp.dest('./assets/css/'));
});