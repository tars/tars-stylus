var gulp = require('gulp');
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var autoprefix = require('gulp-autoprefixer');
var replace = require('gulp-replace-task');
var notify = require('gulp-notify');
var tarsConfig = require('../../../tars-config');
var notifier = require('../../helpers/notifier');
var browserSync = require('browser-sync');

var stylusFilesToConcatinate = [
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/normalize.styl',
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/libraries/**/*.styl',
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/libraries/**/*.css',
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/mixins.styl',
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/sprites-stylus/sprite_96.styl',
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/sprites-stylus/sprite-png-ie.styl'
    ];

    if (tarsConfig.useSVG) {
        stylusFilesToConcatinate.push(
            './markup/' + tarsConfig.fs.staticFolderName + '/stylus/sprites-stylus/svg-fallback-sprite.styl'
        );
    }

    stylusFilesToConcatinate.push(
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/fonts.styl',
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/vars.styl',
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/GUI.styl',
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/common.styl',
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/plugins/**/*.styl',
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/plugins/**/*.css',
        './markup/modules/*/*.styl',
        './markup/modules/*/ie/ie8.styl',
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/etc/**/*.styl'
    );

/**
 * Stylus compilation for ie8
 * @param  {Object} buildOptions
 */
module.exports = function(buildOptions) {

    var patterns = [];

    patterns.push(
        {
            match: '%=staticPrefixForCss=%',
            replacement: tarsConfig.staticPrefixForCss()
        }
    );

    return gulp.task('css:compile-css-for-ie8', function(cb) {
        if (gutil.env.ie8) {
            return gulp.src(stylusFilesToConcatinate)
                .pipe(plumber())
                .pipe(concat('main_ie8' + buildOptions.hash + '.styl'))
                .pipe(replace({
                    patterns: patterns,
                    usePrefix: false
                }))
                .pipe(stylus())
                .on('error', notify.onError(function (error) {
                    return '\nAn error occurred while compiling css for ie8.\nLook in the console for details.\n' + error;
                }))
                .pipe(autoprefix('ie 8', { cascade: true }))
                .on('error', notify.onError(function (error) {
                    return '\nAn error occurred while autoprefixing css.\nLook in the console for details.\n' + error;
                }))
                .pipe(gulp.dest('./dev/' + tarsConfig.fs.staticFolderName + '/css/'))
                .pipe(browserSync.reload({stream:true}))
                .pipe(
                    notifier('Styl-files for ie8 have been compiled')
                );
        } else {
            gutil.log('!Stylies for ie8 are not used!');
            cb(null);
        }
    });
};