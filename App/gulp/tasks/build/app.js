/*******************************
 Setup
*******************************/

const gulp = require("gulp");
const rename = require("gulp-rename");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const gulpif = require("gulp-if");
const htmlmin = require("gulp-htmlmin");
const svgsprite = require("gulp-svg-sprite");
const imagemin = require("gulp-imagemin");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const paths = require("../../paths.js");
const common = require("../../common.js");
const env = require("../../env.js");
const sassGlobImport = require("../../modules/sass-glob-import");
const executeWebpack = require("./webpack").executeWebpack;

/*******************************
 Tasks
*******************************/

gulp.task("build:app-scripts", done => {
    executeWebpack({ configurationFile: `${paths.gulpRoot}webpack.config.js` }, done);
});

gulp.task("build:app-html", () => {
    const htmlminOptions = {
        collapseWhitespace: true,
        conservativeCollapse: true
    };

    return gulp
        .src(paths.app.html.index)
        .pipe(plumber({
            errorHandler: error => {
                common.handleError(error);
            }
        }))
        .pipe(replace("%version%", env.version))
        .pipe(replace("%app-output%", paths.appOutput))
        .pipe(replace("%semantic-output%", paths.semanticOutput))
        .pipe(replace("%vendors-output%", paths.vendorsOutput))
        .pipe(gulpif(env.isRelease, htmlmin(htmlminOptions)))
        .pipe(gulp.dest(paths.appOutput));
});

gulp.task("build:app-styles", () => {
    const postCssProcessors = [
        autoprefixer({ browsers: ["last 2 versions"] })
    ];

    if (env.isRelease) {
        postCssProcessors.push(cssnano());
    }

    return gulp
        .src(paths.app.styles.main)
        .pipe(plumber({
            errorHandler: error => {
                common.handleError(error);
            }
        }))
        .pipe(gulpif(!env.isRelease, sourcemaps.init()))
        .pipe(sassGlobImport())
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss(postCssProcessors))
        .pipe(gulpif(!env.isRelease, sourcemaps.write()))
        .pipe(rename(paths.app.styles.outputName))
        .pipe(gulp.dest(paths.appOutput));
});

const createSvgSprite = () => gulp
    .src(paths.app.images.svg)
    .pipe(plumber({
        errorHandler: error => {
            common.handleError(error);
        }
    }))
    .pipe(imagemin({
        svgoPlugins: [{ removeTitle: true }]
    }))
    .pipe(svgsprite({
        mode: {
            symbol: {
                dest: paths.appImagesOutput,
                prefix: ".svg--%s",
                sprite: paths.app.images.svgSpriteName,
                example: !env.isRelease
            }
        },
        svg: {
            xmlDeclaration: false,
            doctypeDeclaration: false
        }
    }))
    .pipe(gulp.dest("."));

gulp.task("build:app-svg-images", done => {
    common.fileExists(`${paths.appImagesOutput}${paths.app.images.svgSpriteName}`, spriteExists => {
        if (!spriteExists) {
            createSvgSprite().on("end", () => {
                done();
            });
        }
        else {
            done();
        }
    });
});

gulp.task("build:app-svg-images:force", () => createSvgSprite());

gulp.task("build:app-other-images", () => gulp
    .src(paths.app.images.others)
    .pipe(gulp.dest(`${paths.appOutput}`)));

/*******************************
Exports
*******************************/

gulp.task("build:app", [
    "build:app-scripts",
    "build:app-html",
    "build:app-styles",
    "build:app-svg-images",
    "build:app-other-images"]);

gulp.task("build:app:force", [
    "build:app-scripts",
    "build:app-html",
    "build:app-styles",
    "build:app-svg-images:force",
    "build:app-other-images"]);
