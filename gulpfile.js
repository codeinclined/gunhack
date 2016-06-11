var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var jsFiles = ['src/head.js', 'src/**/!(entrypoint)*.js', 'src/entrypoint.js'];
var jsDest  = 'dist';
var jsName = "gunhack";

gulp.task('make-dist', function() {
    return gulp.src(jsFiles)
        .pipe(concat(jsName + ".js"))
        .pipe(gulp.dest(jsDest))
        .pipe(jshint())
        .pipe(jshint.reporter('default', { verbose: true }))
        .pipe(jshint.reporter('fail'))
        .pipe(rename(jsName + ".min.js"))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
