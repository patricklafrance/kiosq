/*******************************
 Setup
*******************************/

const gulp = require("gulp");

const paths = require("../../paths.js");
const common = require("../../common.js");
const semanticBuild = require("../../../semantic/tasks/build");

/*******************************
 Tasks & Exports
*******************************/

gulp.task("build:semantic", done => {
    // The "/dist/semantic" will always exists because we copy the calendar files inside, to ensure that the semantic library
    // has really been compiled, we check for the existant on the "components" folder.
    common.fileExists(`${paths.semanticOutput}semantic.min.js`, semanticFolderExists => {
        if (!semanticFolderExists) {
            semanticBuild(done);
        }
        else {
            done();
        }
    });
});

gulp.task("build:semantic:force", done => {
    semanticBuild(done);
});
