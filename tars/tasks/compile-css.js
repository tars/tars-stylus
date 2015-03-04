var gulp = require('gulp');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
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
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/spritesStylus/sprite96.styl',
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/spritesStylus/sprite.styl'
    ];

var useAutoprefixer = false;
var helperStream;
var mainStream;
var ie9Stream;

if (tarsConfig.autoprefixerConfig) {
    useAutoprefixer = true;
}

if (tarsConfig.useSVG) {
    stylusFilesToConcatinate.push(
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/spritesStylus/svg-fallback-sprite.styl',
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/spritesStylus/svg-sprite.styl'
    );
}

stylusFilesToConcatinate.push(
    './markup/' + tarsConfig.fs.staticFolderName + '/stylus/fonts.styl',
    './markup/' + tarsConfig.fs.staticFolderName + '/stylus/vars.styl',
    './markup/' + tarsConfig.fs.staticFolderName + '/stylus/GUI.styl',
    './markup/' + tarsConfig.fs.staticFolderName + '/stylus/common.styl',
    './markup/' + tarsConfig.fs.staticFolderName + '/stylus/plugins/**/*.styl',
    './markup/' + tarsConfig.fs.staticFolderName + '/stylus/plugins/**/*.css',
    './markup/modules/*/*.styl'
);

/**
 * Stylus compilation
 * @param  {Object} buildOptions
 */
module.exports = function(buildOptions) {

    var patterns = [];

    patterns.push(
        {
            match: '%=staticPrefix=%',
            replacement: tarsConfig.staticPrefix
        }
    );

    return gulp.task('css:compile-css', function() {

        helperStream = gulp.src(scssFilesToConcatinate);
        mainStream = helperStream.pipe(addsrc.append('./markup/' + tarsConfig.fs.staticFolderName + '/scss/etc/**/*.styl'));
        ie9Stream = helperStream.pipe(
                                addsrc.append([
                                        './markup/modules/*/ie/ie9.styl',
                                        './markup/' + tarsConfig.fs.staticFolderName + '/scss/etc/**/*.styl'
                                    ])
                            );

        mainStream
            .pipe(concat('main' + buildOptions.hash + '.styl'))
            .pipe(replace({
                patterns: patterns,
                usePrefix: false
            }))
            .pipe(stylus())
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while compiling css.\nLook in the console for details.\n' + error;
            }))
            .pipe(
                gulpif(useAutoprefixer,
                    autoprefixer(
                        {
                            browsers: tarsConfig.autoprefixerConfig,
                            cascade: true
                        }
                    )
                )
            )
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while autoprefixing css.\nLook in the console for details.\n' + error;
            }))
            .pipe(gulp.dest('./dev/' + tarsConfig.fs.staticFolderName + '/css/'))
            .pipe(browserSync.reload({stream:true}))
            .pipe(
                notifier('Stylus-files\'ve been compiled')
            );

        return ie9Stream
            .pipe(plumber())
            .pipe(concat('main_ie9' + buildOptions.hash + '.styl'))
            .pipe(replace({
                patterns: patterns,
                usePrefix: false
            }))
            .pipe(stylus())
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while compiling css for ie9.\nLook in the console for details.\n' + error;
            }))
            .pipe(autoprefixer('ie 9', { cascade: true }))
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while autoprefixing css.\nLook in the console for details.\n' + error;
            }))
            .pipe(gulp.dest('./dev/' + tarsConfig.fs.staticFolderName + '/css/'))
            .pipe(browserSync.reload({stream:true}))
            .pipe(
                notifier('Stylus-files for ie9 have been compiled')
            );
    });
};