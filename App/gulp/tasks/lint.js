/*******************************
 Setup
*******************************/

const gulp = require("gulp");
const eslint = require("gulp-eslint");
const postCss = require("gulp-postcss");
const postCssReporter = require("postcss-reporter");
const postCssScssSyntax = require("postcss-scss");
const postCssLessSyntax = require("postcss-less");
const stylelint = require("stylelint");
const htmlhint = require("gulp-htmlhint");

const paths = require("../paths.js");
const env = require("../env.js");

/*******************************
 Tasks
*******************************/

gulp.task("lint:scripts", () => gulp
    .src([
        paths.gulpRoot,
        paths.global.scripts.all,
        paths.app.scripts,
        paths.app.html.all,
        paths.staticPages.scripts,
        paths.staticPages.html,
        paths.uikit.scripts,
        paths.uikit.html.all,
        paths.mocks.scripts,
        paths.test.unit,
        paths.test.e2e.src
    ])
    .pipe(eslint({
        ext: [".js", ".html"]
    }))
    .pipe(eslint.format()));

gulp.task("lint:html", () => gulp
    .src(paths.app.html.all)
    .pipe(htmlhint(".htmlhintrc"))
    .pipe(htmlhint.reporter("htmlhint-stylish")));

gulp.task("lint:styles", () => {
    const reporterOptions = {
        clearMessages: true
    };

    const postCssProcessors = [
        stylelint(),
        postCssReporter(reporterOptions)
    ];

    const postCssOptions = {
        syntax: postCssScssSyntax
    };

    return gulp
        .src(paths.app.styles.all)
        .pipe(postCss(postCssProcessors, postCssOptions));
});

gulp.task("lint:semantic-site-folder", () => {
    const reporterOptions = {
        clearMessages: true
    };

    const postCssProcessors = [
        /* eslint-disable */
        stylelint(require("../../semantic/.stylelintrc.json")),
        /* eslint-enable */
        postCssReporter(reporterOptions)
    ];

    const postCssOptions = {
        syntax: postCssLessSyntax
    };

    return gulp
        .src(paths.semantic.site)
        .pipe(postCss(postCssProcessors, postCssOptions));
});

/*******************************
 Exports
*******************************/

gulp.task("lint", [
    "lint:scripts",
    "lint:styles",
    "lint:html",
    "lint:semantic-site-folder"]);
