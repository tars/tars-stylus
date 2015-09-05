'use strict';

var gulp = tars.packages.gulp;
var gutil = tars.packages.gutil;
var concat = tars.packages.concat;
var stylus = tars.packages.stylus;
var plumber = tars.packages.plumber;
var autoprefixer = tars.packages.autoprefixer;
tars.packages.promisePolyfill.polyfill();
var postcss = tars.packages.postcss;
var replace = tars.packages.replace;
var notify = tars.packages.notify;
var notifier = tars.helpers.notifier;
var browserSync = tars.packages.browserSync;

var stylusFolderPath = './markup/' + tars.config.fs.staticFolderName + '/stylus';
var stylusFilesToConcatinate = [
        stylusFolderPath + '/normalize.styl',
        stylusFolderPath + '/libraries/**/*.styl',
        stylusFolderPath + '/libraries/**/*.css',
        stylusFolderPath + '/mixins.styl',
        stylusFolderPath + '/sprites-stylus/sprite_96.styl',
        stylusFolderPath + '/sprites-stylus/sprite-png-ie.styl'
    ];
var patterns = [];
var processors = [
    autoprefixer({browsers: ['ie 8']})
];

if (tars.config.postprocessors && tars.config.postprocessors.length) {
    processors.push(tars.config.postprocessors);
}

if (tars.config.useSVG) {
    stylusFilesToConcatinate.push(
        stylusFolderPath + '/sprites-stylus/svg-fallback-sprite.styl'
    );
}

stylusFilesToConcatinate.push(
    stylusFolderPath + '/fonts.styl',
    stylusFolderPath + '/vars.styl',
    stylusFolderPath + '/GUI.styl',
    stylusFolderPath + '/common.styl',
    stylusFolderPath + '/plugins/**/*.styl',
    stylusFolderPath + '/plugins/**/*.css',
    './markup/modules/*/*.styl',
    './markup/modules/*/ie/ie8.styl',
    stylusFolderPath + '/etc/**/*.styl'
);

patterns.push(
    {
        match: '%=staticPrefixForCss=%',
        replacement: tars.config.staticPrefixForCss()
    }
);

/**
 * Stylus compilation for ie8
 */
module.exports = function () {

    return gulp.task('css:compile-css-for-ie8', function (cb) {
        if (tars.flags.ie8) {
            return gulp.src(stylusFilesToConcatinate)
                .pipe(plumber())
                .pipe(concat('main_ie8' + tars.options.build.hash + '.styl'))
                .pipe(replace({
                    patterns: patterns,
                    usePrefix: false
                }))
                .pipe(stylus())
                .on('error', notify.onError(function (error) {
                    return '\nAn error occurred while compiling css for ie8.\nLook in the console for details.\n' + error;
                }))
                .pipe(postcss(processors))
                .on('error', notify.onError(function (error) {
                    return '\nAn error occurred while postprocessing css.\nLook in the console for details.\n' + error;
                }))
                .pipe(gulp.dest('./dev/' + tars.config.fs.staticFolderName + '/css/'))
                .pipe(browserSync.reload({ stream: true }))
                .pipe(
                    notifier('Styl-files for ie8 have been compiled')
                );
        } else {
            gutil.log('!Stylies for ie8 are not used!');
            cb(null);
        }
    });
};