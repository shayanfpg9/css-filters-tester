const { src, dest, watch, series } = require("gulp"),
  sass = require("gulp-sass")(require("sass"));

function buildStyles() {
  return src("src/sass/*.scss")
    .pipe(sass())
    .pipe(dest("dist/css"));
}

function watchTask() {
  watch(["src/sass/*.scss"], buildStyles);
}

exports.default = series(buildStyles, watchTask);
