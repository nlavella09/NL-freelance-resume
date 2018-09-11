var gulp = require('gulp');
var gulpIf = require('gulp-if');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
//templating
var twig = require('gulp-twig');
//concat & minify
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
//dev help
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
//compatibility
var prefixer = require('gulp-autoprefixer');
//deal with images
var imagemin = require('gulp-imagemin');
var imageminJpegtran = require('imagemin-jpegtran');
var imageminPngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
//clean it up
var del = require('del');
var runSequence = require('run-sequence');

//default tasks - just call gulp
/*gulp.task('default', function(callback){
  //sets up dev build area
  runSequence(['sass','templates','browserSync','watch'],
    callback
  );
});*/

//RUNNING DEV
gulp.task('dev', ['browserSync', 'sass', 'js', 'templates'], function(){
  //watches for sass compile needed
  gulp.watch('src/scss/**/*.scss', ['sass']);

  //watches for twig compile needed
  gulp.watch('src/**/*.html', ['templates']);

  //watches for js changes and copy files over
  gulp.watch('src/**/*.js', ['js']);

  //reloads browser whenever HTML changes
  gulp.watch('dev/*.html', browserSync.reload);

  //reload browser on js file changes
  //gulp.watch('dev/**/*.js', broswerSync.reload);
});

//Build distrubution copy
gulp.task('build', function(callback){
  runSequence('clean:dist',
    ['sass','js','catMin','images'],
    callback
  )
});

//Copy js files to dev
gulp.task('js', function(){
  gulp.src('src/js/*.js')
  .pipe(gulp.dest('dev/assets/js'));
});

//Copy libs files to dev
gulp.task('libs', function(){
  gulp.src('src/libs/**')
  .pipe(gulp.dest('dev/assets/libs'));
});

//SCSS Compile
gulp.task('sass', function(){
  //Individual file: return gulp.src('app/scss/style.scss')
  
  //Just main gets sassified
  return gulp.src('src/scss/main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dev/assets/css')) 
    .pipe(browserSync.reload({
      stream: true
    }))
  
  //All files inside scss get sassified
  //return gulp.src('app/scss/**/*.scss')
  //  .pipe(sass())
  //  .pipe(gulp.dest('app/css'))
  //  .pipe(browserSync.reload({
  //    stream: true
  //  }))
   
});

//Setup browswerSync
gulp.task('browserSync', function(){
  browserSync.init({
    server:{
      baseDir: 'dev'
    },
    browser:'google chrome'
  })
});

//dynamically build pages
gulp.task('templates', function(){
  return gulp.src('src/pages/*.html')
    .pipe(twig())
    .pipe(gulp.dest('dev'));
});

//Concat and minify
gulp.task('catMin', function(){
  //concats and minifys JS
  return gulp.src('dev/*.html')
    .pipe(useref())
    //minifies only if it's JS
    .pipe(gulpIf('*.js', uglify()))
    //minifies if CSS
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulpIf('*.css', prefixer('last 2 versions')))
    .pipe(gulp.dest('dist'))
});

//optimize images
gulp.task('images', function(){
  return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin([
      imageminPngquant({
        speed: 1,
        quality: 80
      }),
      imageminJpegtran({
        progressive: true
      })
    ])))
    .pipe(gulp.dest('dev/assets/images'));
});

//clean it up
gulp.task('clean:dist', function(){
  return del.sync('dist');
});
