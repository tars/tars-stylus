var gulp = require('gulp');
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var replace = require('gulp-replace-task');
var notify = require('gulp-notify');
var tarsConfig = require('../../../tars-config');
var notifyConfig = tarsConfig.notifyConfig;
var modifyDate = require('../../helpers/modifyDateFormatter');
var browserSync = require('browser-sync');

var stylusFilesToConcatinate = [
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/normalize.styl',
        './markup/' + tarsConfig.fs.staticFolderName + '/stylus/libraries/**/*.styl',
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
                gulpif(notifyConfig.useNotify,
                    notify({
                        onLast: true,
                        sound: notifyConfig.sounds.onSuccess,
                        title: notifyConfig.title,
                        message: 'Stylus-files\'ve been compiled. \n'+ notifyConfig.taskFinishedText +'<%= options.date %>',
                        templateOptions: {
                            date: modifyDate.getTimeOfModify()
                        }
                    })
                )
            );
        });
};