var componenentName = 'web-share-shim';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    htmlmin = require('gulp-htmlmin'),
    replace = require('gulp-replace'),
    insert = require('gulp-insert'),
    fs = require("fs"),
    minify = require('gulp-babel-minify'),
    clean = require('gulp-clean'),
    merge = require('merge2');

gulp.task('clean', function () {
    return gulp.src([
        componenentName + '.bundle.min.js',
        componenentName + '.nimiq.min.js',
        componenentName + '.html',
    ], {read: false}).pipe(clean());
});

function minifyCss() {
    return gulp.src('src/*.css')
        .pipe(cleanCSS());
}

function minifyHtml() {
    return gulp.src('src/*.html')
        .pipe(htmlmin({collapseWhitespace: true}));
}

function minifyJs(jsStream) {
    return jsStream
        .pipe(minify({
            mangle: {
                keepClassName: true
            }
        }));
}

function buildTemplate() {
    const cssStream = minifyCss().pipe(insert.wrap('<style>', '</style>'));
    const htmlStream = minifyHtml().pipe(replace('<link rel="stylesheet" href="/src/style.css" type="text/css">', ''));
    return merge(cssStream, htmlStream)
        .pipe(concat(componenentName + '.html'));
}

async function buildBundle(templateStream) {
    return new Promise(resolve => {
        templateStream.on('data', file => {
            const template = file.contents.toString();
            const bundleStream = gulp.src(['src/*.js'])
                .pipe(replace("fetch('../src/template.html').then(response => response.text())",
                    'Promise.resolve(`' + template + '`)'));
            resolve(minifyJs(bundleStream)
                .pipe(rename(componenentName + '.bundle.min.js')));
        });
    });
}

gulp.task('default', async () => {
    const templateStream = buildTemplate();
    const bundleStream = (await buildBundle(templateStream)).pipe(gulp.dest('.'));
    return merge(templateStream, bundleStream);
});

// lazy loading version for nimiq apps
gulp.task('build-nimiq', () => {
    const templateStream = buildTemplate().pipe(gulp.dest('.'));
    let nimiqStream = gulp.src(['src/*.js'])
        .pipe(replace("(function(){",
            "export default (function(){"))
        .pipe(replace("fetch('../src/template.html').then(response => response.text())",
            "fetch('/libraries/web-share-shim/web-share-shim.html').then(response => response.text())"));
    nimiqStream = minifyJs(nimiqStream)
        .pipe(insert.prepend('// @asset(/libraries/web-share-shim/web-share-shim.html)\n'))
        .pipe(rename(componenentName + '.nimiq.min.js'))
        .pipe(gulp.dest('.'));
    return merge(templateStream, nimiqStream);
});
