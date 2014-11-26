var gulp = require('gulp');
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var autoprefix = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var projectConfig = require('../../../projectConfig');
var notifyConfig = projectConfig.notifyConfig;
var modifyDate = require('../../helpers/modifyDateFormatter');
var browserSync = require('browser-sync');

var stylusFilesToConcatinate = [
        './markup/' + projectConfig.fs.staticFolderName + '/stylus/normalize.styl',
        './markup/' + projectConfig.fs.staticFolderName + '/stylus/mixins.styl',
        './markup/' + projectConfig.fs.staticFolderName + '/stylus/spritesStylus/sprite96.styl',
        './markup/' + projectConfig.fs.staticFolderName + '/stylus/spritesStylus/sprite-ie.styl'
    ];

    if (projectConfig.useSVG) {
        stylusFilesToConcatinate.push(
            './markup/' + projectConfig.fs.staticFolderName + '/stylus/spritesStylus/svg-fallback-sprite.styl',
            './markup/' + projectConfig.fs.staticFolderName + '/stylus/spritesStylus/svg-sprite-ie.styl'
        );
    }

    stylusFilesToConcatinate.push(
        './markup/' + projectConfig.fs.staticFolderName + '/stylus/fonts.styl',
        './markup/' + projectConfig.fs.staticFolderName + '/stylus/vars.styl',
        './markup/' + projectConfig.fs.staticFolderName + '/stylus/GUI.styl',
        './markup/' + projectConfig.fs.staticFolderName + '/stylus/common.styl',
        './markup/' + projectConfig.fs.staticFolderName + '/stylus/plugins/**/*.styl',
        './markup/modules/*/*.styl',
        './markup/modules/*/ie/ie8.styl',
        './markup/' + projectConfig.fs.staticFolderName + '/stylus/etc/**/*.styl'
    );

/**
 * Stylus compilation for ie8
 * @param  {Object} buildOptions
 */
module.exports = function(buildOptions) {

    return gulp.task('compile-css-for-ie8', function(cb) {
        if (gutil.env.ie8) {
            return gulp.src(stylusFilesToConcatinate)
                .pipe(plumber())
                .pipe(concat('main_ie8' + buildOptions.hash + '.styl'))
                .pipe(stylus())
                .on('error', notify.onError(function (error) {
                    return '\nAn error occurred while compiling css for ie8.\nLook in the console for details.\n' + error;
                }))
                .pipe(autoprefix('ie 8', { cascade: true }))
                .on('error', notify.onError(function (error) {
                    return '\nAn error occurred while autoprefixing css.\nLook in the console for details.\n' + error;
                }))
                .pipe(gulp.dest('./dev/' + projectConfig.fs.staticFolderName + '/css/'))
                .pipe(browserSync.reload({stream:true}))
                .pipe(
                    gulpif(notifyConfig.useNotify,
                        notify({
                            onLast: true,
                            sound: notifyConfig.sounds.onSuccess,
                            title: notifyConfig.title,
                            message: 'styl-files for ie8 have been compiled. \n'+ notifyConfig.taskFinishedText +'<%= options.date %>',
                            templateOptions: {
                                date: modifyDate.getTimeOfModify()
                            }
                        })
                    )
                );
        } else {
            gutil.log('!Stylies for ie8 are not used!');
            cb(null);
        }
    });
};