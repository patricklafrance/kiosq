/*******************************
 Inputs
*******************************/

const gulpRoot = "gulp/";
const nodeRoot = "node_modules/";
const appRoot = "spa/";
const semanticRoot = "semantic/";
const vendorsRoot = "vendors/";

/*******************************
 Outputs
*******************************/

const outputRoot = "dist/";
const appOutput = `${outputRoot}app/`;
const appAssetsOutput = `${appOutput}assets/`;
const appImagesOutput = `${appAssetsOutput}images/`;
const vendorsOutput = `${outputRoot}vendors/`;
const semanticOutput = `${outputRoot}semantic/`;

/*******************************
 Exports
*******************************/

module.exports = {
    app: {
        styles: {
            all: `${appRoot}**/*.scss`,
            main: `${appRoot}main.scss`,
            css: `${appRoot}**/*.css`,
            outputName: "styles.css"
        },
        scripts: `${appRoot}**/*.js`,
        html: {
            all: `${appRoot}**/*.html`,
            index: `${appRoot}index.html`
        },
        images: {
            svg: `${appRoot}**/*.svg`,
            svgSpriteName: "sprite.svg",
            others: `${appRoot}**/*.{png,jpg,jpeg}`
        }
    },
    semantic: {
        site: `${semanticRoot}src/site/**/*`
    },
    gulpRoot,
    nodeRoot,
    appRoot,
    semanticRoot,
    vendorsRoot,
    outputRoot,
    appOutput,
    appAssetsOutput,
    appImagesOutput,
    semanticOutput,
    vendorsOutput
};

