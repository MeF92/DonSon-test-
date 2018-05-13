var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    pug = require('gulp-pug');

gulp.task('pug', function() {
    return gulp.src('source/index.pug')
        .pipe(pug())
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream())
});

gulp.task('sass', function() {
    return gulp.src('source/css/main.sass')
        .pipe(sass())
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream())
});

gulp.task('min-css', function() {
    return gulp.src('source/css/main.sass')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css'))
});

gulp.task('scripts', function() {
   return gulp.src('source/blocks/**/*.js')
       .pipe(concat('main.js'))
       .pipe(uglify())
       .pipe(gulp.dest('build/js'))
       .pipe(browserSync.stream())
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: 'build'
        },
        notify: false
    });
});

gulp.task('clean', function() {
   return del.sync(['build/css/*', 'build/js/*', 'build/fonts/*', 'build/img/*', 'build/*.html']);
});

gulp.task('clear', function() {
    return cache.clearAll();
});

gulp.task('img', function() {
   return gulp.src('source/img/**/*')
       .pipe(cache(imagemin({
           interlaced: true,
           progressive: true,
           svgoPlugins: [{removeViewBox: false}],
           use: [pngquant()]
       })))
       .pipe(gulp.dest('build/img'))
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch(['source/blocks/**/*.sass', 'source/css/*.sass'], ['sass']).on('change', browserSync.reload);
    gulp.watch(['source/blocks/**/*.pug', 'source/index.pug'], ['pug']).on('change', browserSync.reload);
    gulp.watch('source/blocks/**/*.js', ['scripts']).on('change', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'sass', 'pug', 'scripts'], function() {
    var buildCss = gulp.src('source/css/*.css')
        .pipe(gulp.dest('build/css'));

    var buildFonts = gulp.src('source/fonts/*')
        .pipe(gulp.dest('build/fonts'));

    var buildJs = gulp.src('source/js/*.js')
        .pipe(gulp.dest('build/js'));

    // var buildHtml = gulp.src('assets/*.html')
    //     .pipe(gulp.dest('build'));
});
