var componenentName = 'web-share-shim';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	htmlmin = require('gulp-htmlmin'),
	replace = require('gulp-replace'),
	fs = require("fs"),
    minify = require('gulp-babel-minify'),
    clean = require('gulp-clean');


gulp.task('default', ['minify-css','minify-html','stamp-templates','minify-js']);

gulp.task('minify-css', () => {
  return gulp.src('src/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('tmp'));
});

gulp.task('minify-html', function() {
  return gulp.src(	'src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('tmp'));
});
 
gulp.task('minify-js', () =>
  gulp.src('tmp/script.js')
    .pipe(minify({
      mangle: {
        keepClassName: true
      }
    }))
    .pipe(rename(componenentName+'.min.js'))
    .pipe(gulp.dest('.')));


gulp.task('stamp-templates', function(){
  var htmlTemplate = fs.readFileSync("tmp/template.html", "utf8");
  var cssTemplate = fs.readFileSync("tmp/style.css", "utf8");
  gulp.src(['src/*.js'])
    .pipe(replace('${htmlTemplate}', htmlTemplate))
    .pipe(replace('${cssTemplate}', cssTemplate))
    .pipe(replace('async function(', 'function('))
    .pipe(replace("const htmlTemplate = await fetch('src/template.html').then(response => response.text());", ''))
    .pipe(replace("const cssTemplate = await fetch('src/style.css').then(response => response.text());", ''))
    .pipe(gulp.dest('tmp/'));
});

 
gulp.task('clean', function () {
    return gulp.src('tmp', {read: false})
        .pipe(clean());
});
