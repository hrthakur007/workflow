'use strict';

var gulp 			= 	require('gulp'),
	autoprefixer	=	require('gulp-autoprefixer'),
	bourbon 		=	require('node-bourbon'),
	browserSync		=	require('browser-sync'),
	cleanCSS		=	require('gulp-clean-css'),
	del 			=	require('del'),
	imagemin 		=	require('gulp-imagemin'),
	pngquant 		= 	require('imagemin-pngquant'),
	plumber 		= 	require('gulp-plumber'),
    rename 			= 	require('gulp-rename'),
    replace 		= 	require('gulp-replace'), 
    rigger 			= 	require('gulp-rigger'),
    sass 			= 	require('gulp-sass'),
    sourcemaps 		= 	require('gulp-sourcemaps'),
    watch 			= 	require('gulp-watch'),
    uglify 			= 	require('gulp-uglify'),
    stream 			= 	require('merge-stream'),
    concat 			= 	require('gulp-concat'),
    watch 			= 	require('gulp-watch');	


/*====================================
=            Browser sync            =
====================================*/

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './build-dev'
        },
        notify: false,
        port: 8080
    });
});


/*=====  End of Browser sync  ======*/




/*======================================
=            build-dev task            =
======================================*/

gulp.task('build-dev:html', function (callback) {
    return gulp.src('src/*.html')
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest('build-dev/'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('build-dev:js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(plumber())
        .pipe(gulp.dest('build-dev/js/'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('build-dev:sass', function () {
    var path = process.cwd() + '/src/';
    return gulp.src('src/sass/style.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: bourbon.includePaths,
            errLogToConsole: true,
            sourceComments: 'map',
            sourceMap: 'sass',
            outputStyle: 'expanded'
        }))
        .pipe(autoprefixer({
            browsers: ['last 20 versions']
        }))
        .pipe(replace(path, ''))
        .pipe(gulp.dest('build-dev/css/'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('build-dev:images', function () {
    return gulp.src('src/images/**/*')
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest('build-dev/images/'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('build-dev:fonts', function () {
    return gulp.src('src/fonts/*')
        .pipe(plumber())
        .pipe(gulp.dest('build-dev/fonts/'))
});

gulp.task('build-dev:bower', function () {
    var bower_components = require('./bower_components');
    var bower_js = gulp.src(bower_components.js)
        .pipe(plumber())
        .pipe(concat('assets.js'))
        .pipe(gulp.dest('build-dev/js/'));
    var bower_css = gulp.src(bower_components.css)
        .pipe(plumber())
        .pipe(concat('assets.css'))
        .pipe(gulp.dest('build-dev/css/'));
    var bower_fonts = gulp.src(bower_components.fonts)
        .pipe(plumber())
        .pipe(gulp.dest('build-dev/fonts/'));
    return stream(bower_js, bower_css, bower_fonts)
});


gulp.task('build-dev', [
    'build-dev:html',
    'build-dev:sass',
    'build-dev:js',
    'build-dev:images',
    'build-dev:fonts',
    'build-dev:bower'
]);

/*=====  End of build-dev task  ======*/



/*===================================
=            watch tasks            =
===================================*/

var watchFiles = {
    html 	: 	'src/**/*.html',
    sass 	: 	'src/sass/**/*.scss',
    js 		: 	'src/js/**/*.js',
    images 	: 	'src/images/**/*.*',
    fonts 	: 	'src/fonts/*.*',
    bower 	: 	'bower_components/'
};

gulp.task('watch', function () {

    watch([watchFiles.html], function (event, cb) {
        gulp.start('build-dev:html');
    });

    watch([watchFiles.sass], function (event, cb) {
        gulp.start('build-dev:sass');
    });

    watch([watchFiles.js], function (event, cb) {
        gulp.start('build-dev:js');
    });

    watch([watchFiles.images], function (event, cb) {
        gulp.start('build-dev:images');
    });

    watch([watchFiles.fonts], function (event, cb) {
        gulp.start('build-dev:fonts');
    });

    watch([watchFiles.bower], function (event, cb) {
        gulp.start('build-dev:bower');
    });

});


/*=====  End of watch tasks  ======*/





/*=========================================
=            Gulp Default Task            =
=========================================*/

gulp.task('default',['build-dev','browser-sync','watch']);

/*=====  End of Gulp Default Task  ======*/
