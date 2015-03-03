var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var tarsConfig = require('../../../tars-config');
var notifier = require('../../helpers/notifier');
var browserSync = require('browser-sync');

/**
 * Make sprite for svg-fallback and stylus for this sprite
 * @param  {Object} buildOptions
 */
module.exports = function(buildOptions) {

    return gulp.task('css:make-fallback-for-svg', function(cb) {
        var spriteData = '';

        if (tarsConfig.useSVG && gutil.env.ie8) {

            spriteData = gulp.src('./dev/' + tarsConfig.fs.staticFolderName + '/' + tarsConfig.fs.imagesFolderName + '/rasterSvgImages/*.png')
                .pipe(
                    spritesmith(
                        {
                            imgName: 'svg-fallback-sprite.png',
                            cssName: 'svg-fallback-sprite.styl',
                            Algorithms: 'diagonal',
                            engineOpts: {
                                imagemagick: true
                            },
                            cssTemplate: './markup/' + tarsConfig.fs.staticFolderName + '/stylus/spriteGeneratorTemplates/stylus.svgFallbackSprite.mustache'
                        }
                    )
                )
                .on('error', notify.onError(function (error) {
                    return '\nAn error occurred while making fallback for svg.\nLook in the console for details.\n' + error;
                }));

            spriteData.img.pipe(gulp.dest('./dev/' + tarsConfig.fs.staticFolderName + '/' + tarsConfig.fs.imagesFolderName + '/rasterSvgSprite/'))
                .pipe(
                    notifier('Sprite img for svg is ready')
                );

            return spriteData.css.pipe(gulp.dest('./markup/' + tarsConfig.fs.staticFolderName + '/stylus/spritesStylus/'))
                    .pipe(browserSync.reload({stream:true}))
                    .pipe(
                        notifier('Stylus for svg-sprite is ready')
                    );
        } else if (tarsConfig.useSVG) {

            spriteData = gulp.src('./dev/' + tarsConfig.fs.staticFolderName + '/' + tarsConfig.fs.imagesFolderName + '/svg/*.svg')
                .pipe(
                    spritesmith(
                        {
                            imgName: 'svg-fallback-sprite.svg',
                            cssName: 'svg-fallback-sprite.styl',
                            Algorithms: 'diagonal',
                            engineOpts: {
                                imagemagick: true
                            },
                            cssTemplate: './markup/' + tarsConfig.fs.staticFolderName + '/stylus/spriteGeneratorTemplates/stylus.svgFallbackSprite.mustache'
                        }
                    )
                )
                .on('error', notify.onError(function (error) {
                    return '\nAn error occurred while making fallback for svg.\nLook in the console for details.\n' + error;
                }));

                return spriteData.css.pipe(gulp.dest('./markup/' + tarsConfig.fs.staticFolderName + '/stylus/spritesStylus/'))
                    .pipe(browserSync.reload({stream:true}))
                    .pipe(
                        notifier('Stylus for svg-sprite is ready')
                    );
        } else {
            gutil.log('!SVG is not used!');
            cb(null);
        }
    });
};