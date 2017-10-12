// NOTE:
// __dirname is the absolute path of the directory in which this configuration file is.
//
// Good read:
// https://medium.com/@ryandrewjohnson/one-webpack-config-to-rule-them-all-environments-that-is-277457769779
// https://www.npmjs.com/package/webpack-merge
// https://survivejs.com/webpack/developing/composing-configuration/
// https://github.com/kentcdodds/webpack-config-utils

/*******************************
 Setup
*******************************/

const path = require("path");
const { optimize: { CommonsChunkPlugin } } = require("webpack");
const merge = require("webpack-merge");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const paths = require("./paths");

const root = path.resolve(__dirname, "..");
const nodeRoot = path.resolve(root, paths.nodeRoot);
const appRoot = path.resolve(root, paths.appRoot);
const appOutput = path.resolve(root, paths.appOutput);

/*******************************
 Common
*******************************/

const common = {
    // target: "web",
    // It would be very nice to include all the aurelia modules as an entry but there is a lot of issues regarding the
    // order that the Aurelia dependencies are loaded when doing it. For more information view: https://github.com/aurelia/pal-browser/issues/17
    entry: {
        // "app": "aurelia-bootstrapper",
        "vendors": [
            "lodash"
        ]
    },
    output: {
        path: appOutput,
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js"
    },
    resolve: {
        extensions: [".js"],
        modules: [appRoot, nodeRoot]
    },
    module: {
        rules: [
            { test: /\.js$/i, loader: "babel-loader", exclude: [nodeRoot] },
            { test: /\.html$/i, loader: "html-loader" }
        ]
    },
    plugins: [
        new CommonsChunkPlugin({
            name: "manifest",
            // This ensures that no other module goes into the webpack runtime chunks.
            minChunks: Infinity
        }),
        new CommonsChunkPlugin({
            name: "vendors",
            chunks: ["app", "vendors"],
            // This ensures that no other module goes into the vendor chunks.
            minChunks: Infinity
        })
    ]
};

/*******************************
 Development
*******************************/

const development = {
    cache: true,
    // For more information about source maps options, see: https://survivejs.com/webpack/building/source-maps/
    // The default recommandation for Webpack source maps is "cheap-module-eval-source-map", as of now it doesn't produce reliable source maps for us.
    devtool: "eval-source-map"
};

/*******************************
 Release
*******************************/

const release = {
    plugins: [
        new UglifyJsPlugin()
    ]
};

/*******************************
 Export
*******************************/

module.exports = ({ production } = {}) => {
    const config = merge(common, production ? release : development);

    return config;
};
