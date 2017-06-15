/**
 * Created by ALLIN on 2017/6/15.
 */

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    cleancss = require("gulp-clean-css"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    pump = require("pump"),
    htmlreplace = require('gulp-html-replace');

/*Gulp-Sass编译自动化工程*/
//Task:watch   监听Sass文件变化并自动编译
//Task:bs         hot-reload监听全项目文件，保存后浏览器自动刷新
gulp.task("watch", function() {
    gulp.watch("scss/*.scss", ['sass']);
});

gulp.task("sass", function() {
    return gulp.src("scss/*.scss").
    pipe(sass({ style: "expanded" })).
    pipe(cleancss({
        advanced: false,
        compatibility: 'ie8',
        keepBreaks: false,
        keepSpecialComments: '*'
    })).
    pipe(autoprefixer({
        browsers: ['Android >= 3.5', 'last 4 versions', 'ie >= 8', 'ie_mob >= 10', 'ff >= 30', 'chrome >= 34', 'safari >= 6', 'opera >= 12.1', 'ios >= 6', 'bb >= 10'],
        cascode: true
    })).
    pipe(gulp.dest("css/"));
});

gulp.task('bs', function() {
    var files = ['css/*'];
    browserSync.init(files, {
        server: {
            baseDir: "/"
        }
    });
});