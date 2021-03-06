// general
var browserSync = require('browser-sync');
var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var watch       = require('gulp-watch')
var utils       = require('gulp-util');
var concat      = require('gulp-concat');
var buffer      = require('vinyl-buffer');
var source      = require('vinyl-source-stream');

//css
var sass        = require('gulp-ruby-sass');
var prefix      = require('gulp-autoprefixer');

//javascript
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var annotate    = require('gulp-ng-annotate');

paths = {
  libs: [
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js'
  ]
};

gulp.task('default', ['build', 'watch']);

function generateSass () {
  return sass('app/index.sass', {quiet: true})
    .pipe(plumber({errorHandler: utils.reportError}))
    .pipe(prefix("last 2 versions"))
    .pipe(concat('app.css'))
    .pipe(plumber.stop())
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({stream:true}));
};

gulp.task('sass', generateSass);

gulp.task('js', function() {
  gulp.src('app/index.js')
  .pipe(annotate())
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(uglify({ mangle: false }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('build'));
});

gulp.task('watch', function () {
  gulp.watch('./app/**/*.js', ['js']);
  gulp.watch('./app/**/*.sass', ['sass']);
  browserSync({
    server: {baseDir: 'build'},
    browser: 'google chrome',
    injectChanges: false,
    files: ['build/**/*.*'],
    notify: false
  });
});

gulp.task('copy', function() {
  gulp.src('app/index.html').pipe(gulp.dest('build'))
});

gulp.task('libs', function() {
  return gulp.src(paths.libs)
    .pipe(concat('libs.js'))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build'));
});

gulp.task('build', ['copy', 'libs', 'js', 'sass']);