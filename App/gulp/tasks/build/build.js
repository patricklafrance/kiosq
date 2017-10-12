/*******************************
 Setup
*******************************/

const gulp = require("gulp");
const del = require("del");
const runSequence = require("run-sequence");
const _ = require("lodash");

const paths = require("../../paths.js");
const common = require("../../common.js");

/*******************************
 Tasks
*******************************/

const buildWhitelist = () => {
    const semantic = [common.removeTrailingSlash(`!${paths.semanticOutput}`), `!${paths.semanticOutput}**`];
    const appSprite = [`!${paths.appImagesOutput}${paths.app.images.svgSpriteName}`, `!${paths.appImagesOutput}${paths.app.images.svgSpriteName.replace(".svg", ".symbol.html")}`, common.removeTrailingSlash(`!${paths.appImagesOutput}`), common.removeTrailingSlash(`!${paths.appAssetsOutput}`), common.removeTrailingSlash(`!${paths.appOutput}`)];

    return _(_.concat(semantic, appSprite))
        .uniq()
        .value();
};

gulp.task("build:clean", callback => {
    const whitelist = buildWhitelist();

    /*eslint-disable */
    del(_.concat([`${paths.outputRoot}**`, common.removeTrailingSlash(`!${paths.outputRoot}`)], whitelist)).then(() => {
        callback();
    });
    /*eslint-enable */
});

/*******************************
 Exports
*******************************/

gulp.task("build:all", done =>
    runSequence(
        "build:clean",
        "build:app:force",
        "build:semantic:force",
        "copy",
        done));

gulp.task("build", done =>
    runSequence(
        "build:clean",
        "build:app",
        "build:semantic",
        "copy",
        done));
