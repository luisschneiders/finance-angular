const gulp = require('gulp');
const gulpif = require('gulp-if');
const argv = require('yargs').argv;
const concat = require('gulp-concat');
const ngAnnotate = require('gulp-ng-annotate');
const templateCache = require('gulp-angular-templatecache');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const ngConfig = require('gulp-ng-config');
const fs = require('fs');
const config = require('./config.js');
const ENV = process.env.APP_ENV || 'development';

gulp.task('ng-config', function() {
  fs.writeFileSync('./config.json', JSON.stringify(config[ENV]));
  return gulp.src('./config.json')
    .pipe(
      ngConfig('MyApp', {
        createModule: false
      }))
    .pipe(gulp.dest('public/config'))
});

gulp.task('sass', function() {
  return gulp.src('public/css/main.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulpif(argv.production, csso()))
    .pipe(gulp.dest('public/css'));
});

gulp.task('angular', function() {
  return gulp.src([
    'app/app.js',
    'app/components/**/*.js',
    'app/shared/**/*.js',
  ])
    .pipe(concat('application.js'))
    .pipe(ngAnnotate())
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('public/js'));
});

gulp.task('templates', function() {
  return gulp.src(['app/components/**/*.html', 'app/shared/**/*.html'])
    .pipe(templateCache({ root: 'components', module: 'MyApp' }))
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('public/js'));
});

gulp.task('vendor', function() {
  return gulp.src(['app/vendor/*.js'])
    .pipe(sourcemaps.init())
    .pipe(gulpif(argv.production, uglify()))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('public/js/lib'));
});

gulp.task('misc', function () {
  return gulp.src(['manifest.json'])
    .pipe(gulp.dest('public/misc'));
});

gulp.task('watch', function() {
  gulp.watch('public/css/**/*.scss', ['sass']);
  gulp.watch('app/**/**/*.html', ['templates']);
  gulp.watch('app/**/**/*.js', ['angular']);
});

gulp.task('build', ['ng-config', 'sass', 'angular', 'vendor', 'templates', 'misc']);
gulp.task('default', ['build', 'watch']);
