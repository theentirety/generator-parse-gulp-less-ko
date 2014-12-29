'use strict';

var gulp = require('gulp');
var buildFolder = 'build';
var distFolder = 'dist/public';

var deployMode = false;

// Load plugins
var $ = require('gulp-load-plugins')();
var mainBowerFiles = require('main-bower-files');

// Styles
gulp.task('styles', ['vendor-styles'], function () {
  gulp.src('app/less/app.less')
    .pipe($.less())
    .pipe($.autoprefixer('last 1 version'))
    .pipe($.if(deployMode, $.csso()))
    .pipe($.if(deployMode, gulp.dest(distFolder + '/styles')))
    .pipe($.if(!deployMode, gulp.dest(buildFolder + '/styles')))
    .pipe($.size())
    .pipe($.if(!deployMode, $.connect.reload()))
    .on('error', $.util.log);
});

// Styles
gulp.task('vendor-styles', function () {
  // uncomment this if you include vendor styles
  // gulp.src([
  //     'bower_components/getskeleton1200/skeleton1200.css'
  //   ])
  //   .pipe($.less())
  //   .pipe($.concat('vendor.css'))
  //   .pipe($.autoprefixer('last 1 version'))
  //   .pipe($.if(deployMode, $.csso()))
  //   .pipe($.if(deployMode, gulp.dest(distFolder + '/styles')))
  //   .pipe($.if(!deployMode, gulp.dest(buildFolder + '/styles')))
  //   .pipe($.size())
  //   .pipe($.if(!deployMode, $.connect.reload()))
  //   .on('error', $.util.log);
});

// Vendor Scripts
gulp.task('vendor', function() {
    return gulp.src(mainBowerFiles(), { base: 'bower_components' })
    .pipe($.concat('vendor.js'))
    .pipe($.if(deployMode, $.uglify()))
    .pipe($.if(deployMode, gulp.dest(distFolder + '/scripts')))
    .pipe($.if(!deployMode, gulp.dest(buildFolder + '/scripts')))
    .pipe($.size())
    .on('error', $.util.log);
});

// Scripts
gulp.task('scripts', function () {
  gulp.src('app/scripts/main.js')
    .pipe($.browserify({
      insertGlobals : true,
      debug : !deployMode
    }))
  .pipe($.if(deployMode, $.uglify()))
  .pipe($.if(deployMode, gulp.dest(distFolder + '/scripts')))
  .pipe($.if(!deployMode, gulp.dest(buildFolder + '/scripts')))
  .pipe($.size())
  .pipe($.if(!deployMode, $.connect.reload()))
  .on('error', $.util.log);
});

// HTML
gulp.task('html', ['templates'], function () {
  return gulp.src('app/index.html')
    .pipe($.if(deployMode, $.copy(distFolder, {
      prefix: 1
    })))
    .pipe($.if(!deployMode, $.copy(buildFolder, {
      prefix: 1
    })))
    .on('error', $.util.log);
});

// HTML Templates
gulp.task('templates', function () {
  return gulp.src('app/templates/*.html')
    .pipe($.concat('templates.html'))
    .pipe($.if(deployMode, gulp.dest(distFolder)))
    .pipe($.if(!deployMode, gulp.dest(buildFolder)))
    .pipe($.if(!deployMode, $.connect.reload()))
    .on('error', $.util.log);
});

// Lint
gulp.task('lint', ['scripts'], function () {
  return gulp.src('app/scripts/*.js')
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter(require('jshint-stylish')))
    .on('error', $.util.log);
});

// Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe($.if(deployMode, gulp.dest(distFolder + '/images')))
    .pipe($.if(!deployMode, gulp.dest(buildFolder + '/images')))
    .pipe($.size())
    .on('error', $.util.log);
});

// Fonts
gulp.task('fonts', function () {
  return gulp.src([
    'app/fonts/fonts/**/*',
    '!app/fonts/icons',
    '!app/fonts/packages'
    ])
    .pipe($.if(deployMode, gulp.dest(distFolder + '/fonts')))
    .pipe($.if(!deployMode, gulp.dest(buildFolder + '/fonts')))
    .pipe($.size())
    .pipe($.if(!deployMode, $.connect.reload()))
    .on('error', $.util.log);
});

// Clean
gulp.task('clean', function () {
    return gulp.src([
      buildFolder
    ], {read: false}).pipe($.clean());
});

// Clean Deploy
gulp.task('clean-deploy', function () {
    return gulp.src([
      distFolder + '/'
    ], {read: false}).pipe($.clean());
});

// Build
gulp.task('build', ['styles', 'html', 'scripts', 'vendor', 'images', 'fonts']);

// Dev Server

gulp.task('dev', ['build', 'watch', 'lint']);

// Default task
gulp.task('default', ['clean'], function () {
  gulp.start('dev');
});

// Deploy task
gulp.task('deploy', ['clean-deploy'], function () {
  deployMode = true;
  gulp.start('build');
});

// // Connect
gulp.task('connect', function() {
  $.connect.server({
    root: buildFolder,
    livereload: true,
    port: 9000
  });
});

// Watch
gulp.task('watch', ['connect'], function () {
    // Watch for changes in `app` folder
    gulp.watch([
        'app/less/**/*.less',
        'app/scripts/**/*.js',
        'app/images/**/*',
        'app/templates/**/*.html',
        'app/fonts/fonts/**/*'
    ], $.connect.reload);


    // Watch .less files
    gulp.watch('app/less/**/*.less', ['styles']);

    // Watch .js files
    gulp.watch('app/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('app/images/**/*', ['images']);

    // Watch .html files
    gulp.watch('app/**/*.html', ['templates']);

    // Watch .font files
    gulp.watch('app/fonts/fonts/**/*', ['fonts']);
});
