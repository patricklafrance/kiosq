/*******************************
 Setup
*******************************/

const gulp = require("gulp");
const browserSync = require("browser-sync");

const paths = require("../paths");
const semanticWatch = require("../../semantic/tasks/watch");

/*******************************
 Helpers
*******************************/

const reportChange = event => {
    console.log(`File ${event.path} was ${event.type} running tasks...`);
};

/*******************************
 Exports
*******************************/

gulp.task("watch", ["serve"], () => {
    gulp.watch(paths.app.scripts, ["build:app-scripts", browserSync.reload]).on("change", reportChange);
    gulp.watch(paths.app.html.all, ["build:app-html", browserSync.reload]).on("change", reportChange);
    gulp.watch(paths.app.styles.all, ["build:app-styles", browserSync.reload]).on("change", reportChange);
    gulp.watch(paths.app.images.svg, ["build:app-svg-images", browserSync.reload]).on("change", reportChange);
    gulp.watch(paths.app.images.others, ["build:app-other-images", browserSync.reload]).on("change", reportChange);

    semanticWatch(() => browserSync.reload());
});
