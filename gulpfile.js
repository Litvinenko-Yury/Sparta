"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var htmlmin = require("gulp-htmlmin");
var uglify = require("gulp-uglify");
const ghPages = require('gh-pages');
const path = require('path');

//копируем папки из папки source в папку build.
gulp.task("copyFolderBuild", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "!source/img/*.psd", // .psd не копировать
    "!source/img/Background-*.jpg", //Background-*.jpg не копировать
    "!source/img/background-*.jpg", //background-*.jpg не копировать
    "source/js/**"
  ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

//удаляем папку build.
gulp.task("cleanFolderBuild", function () {
  return del("build");
});

/*делаем из scss-файлов css-файл (gulp-sass), далее расставляем префиксы (postcss + autoprefixer), далее минифицируем css-файл (gulp-csso), переименовываем (gulp-rename) его в "style.min.css", и сохраняем в build/css.*/
gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    // .pipe(server.stream());
});

//собрать svg-спрайт (gulp-svgstore), переименовать спрайт в "svg_sprite.svg" (gulp-rename), и сохранить в build/img.
gulp.task("svg_sprite", function () {
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("svg_sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

//инклюдим svg-спрайт в разметку html-файла
gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

//минификация html-файлов
gulp.task("minify_html", function () {
  return gulp.src("build/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
});

//минификация js-файлов
gulp.task("minify_js", function () {
  return gulp.src("source/js/*.js")
    .pipe(uglify())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"));
});

//локальный сервер (browser-sync).
gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
  gulp.watch("source/img/icon-*.svg", gulp.series("svg_sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("minify_js", "refresh"));
});

//используем browser-sync для перезапуска страницы
gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series(
  "cleanFolderBuild",
  "copyFolderBuild",
  "css",
  "svg_sprite",
  "html",
  "minify_html",
  "minify_js"
));

gulp.task("start", gulp.series("build", "server"));

//----------------------------------------------------------------
//оптимизируем PNG-JPEG-SVG (gulp-imagemin)
gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});

//конвертируем jpg в webp (gulp-webp)
gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 75 }))
    .pipe(gulp.dest("source/img"));
});



//задача публикации на gh-pages
function deploy(cb) {
  ghPages.publish(path.join(process.cwd(), './build'), cb);
}
exports.deploy = deploy;
