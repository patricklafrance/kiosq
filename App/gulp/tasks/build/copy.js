/*******************************
 Setup
*******************************/

const gulp = require("gulp");
const rename = require("gulp-rename");
const _ = require("lodash");

const paths = require("../../paths.js");

const files = [
    [`${paths.nodeRoot}babel-polyfill/dist/polyfill.min.js`, `${paths.vendorsOutput}babel/babel-polyfills.js`],
    [`${paths.nodeRoot}jquery/dist/jquery.min.js`, `${paths.vendorsOutput}jquery/jquery.min.js`]
];

/*******************************
 Tasks
*******************************/

gulp.task("copy:files", () => {
    const streams = _.map(files, x => gulp
        .src(x[0])
        .pipe(rename(x[1]))
        .pipe(gulp.dest(".")));

    return streams;
});

/*******************************
 Exports
*******************************/

gulp.task("copy", ["copy:files"]);
