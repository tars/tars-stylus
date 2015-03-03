var gulp = require('gulp');
var concat = require('gulp-concat');
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
    './markup/modules/*/*.styl',
    './markup/' + tarsConfig.fs.staticFolderName + '/stylus/etc/**/*.styl'
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

    return gulp.task('compile-css', function() {
        return gulp.src(stylusFilesToConcatinate)
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
                (useAutoprefixer) ?
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
        });
};