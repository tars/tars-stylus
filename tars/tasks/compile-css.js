'use strict';

var gulp = tars.packages.gulp;
var gulpif = tars.packages.gulpif;
var concat = tars.packages.concat;
var stylus = tars.packages.stylus;
var plumber = tars.packages.plumber;
var autoprefixer = tars.packages.autoprefixer;
tars.packages.promisePolyfill.polyfill();
var postcss = tars.packages.postcss;
var addsrc = tars.packages.addsrc;
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
        stylusFolderPath + '/sprites-stylus/sprite-png.styl'
    ];
var patterns = [];
var processors = [];
var processorsIE9 = [
    autoprefixer({browsers: ['ie 9']})
];

if (tars.config.autoprefixerConfig) {
    processors.push(
        autoprefixer({browsers: tars.config.autoprefixerConfig})
    );
}

if (tars.config.postprocessors && tars.config.postprocessors.length) {
    processors.push(tars.config.postprocessors);
    processorsIE9.push(tars.config.postprocessors);
}

if (tars.config.useSVG) {
    stylusFilesToConcatinate.push(
        stylusFolderPath + '/sprites-stylus/svg-sprite.styl'
    );
}

stylusFilesToConcatinate.push(
    stylusFolderPath + '/fonts.styl',
    stylusFolderPath + '/vars.styl',
    stylusFolderPath + '/GUI.styl',
    stylusFolderPath + '/common.styl',
    stylusFolderPath + '/plugins/**/*.styl',
    stylusFolderPath + '/plugins/**/*.css',
    './markup/modules/*/*.styl'
);

patterns.push(
    {
        match: '%=staticPrefixForCss=%',
        replacement: tars.config.staticPrefixForCss()
    }
);

/**
 * Stylus compilation
 */
module.exports = function () {

    return gulp.task('css:compile-css', function () {

        var helperStream = gulp.src(stylusFilesToConcatinate);
        var mainStream = helperStream.pipe(addsrc.append(stylusFolderPath + '/etc/**/*.styl'));
        var ie9Stream = helperStream.pipe(
                                addsrc.append([
                                        './markup/modules/*/ie/ie9.styl',
                                        stylusFolderPath + '/etc/**/*.styl'
                                    ])
                            );

        mainStream
            .pipe(concat('main' + tars.options.build.hash + '.styl'))
            .pipe(replace({
                patterns: patterns,
                usePrefix: false
            }))
            .pipe(stylus())
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while compiling css.\nLook in the console for details.\n' + error;
            }))
            .pipe(postcss(processors))
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while postprocessing css.\nLook in the console for details.\n' + error;
            }))
            .pipe(gulp.dest('./dev/' + tars.config.fs.staticFolderName + '/css/'))
            .pipe(browserSync.reload({ stream: true }))
            .pipe(
                notifier('Stylus-files\'ve been compiled')
            );

        return ie9Stream
            .pipe(plumber())
            .pipe(concat('main_ie9' + tars.options.build.hash + '.styl'))
            .pipe(replace({
                patterns: patterns,
                usePrefix: false
            }))
            .pipe(stylus())
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while compiling css for ie9.\nLook in the console for details.\n' + error;
            }))
            .pipe(postcss(processorsIE9))
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while postprocessing css.\nLook in the console for details.\n' + error;
            }))
            .pipe(gulp.dest('./dev/' + tars.config.fs.staticFolderName + '/css/'))
            .pipe(browserSync.reload({ stream: true }))
            .pipe(
                notifier('Stylus-files for ie9 have been compiled')
            );
    });
};