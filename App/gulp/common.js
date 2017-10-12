/*******************************
 Setup
*******************************/

const fs = require("fs");
const gutil = require("gulp-util");
const notify = require("gulp-notify");
const _ = require("lodash");

/*******************************
 Functions
*******************************/

const handleError = error => {
    notify(error.message);

    gutil.log(gutil.colors.red("Error with plugin:"), gutil.colors.gray(error.plugin));
    gutil.log(gutil.colors.magenta("Message:"), gutil.colors.gray(error.message));
    gutil.log(gutil.colors.magenta("Filename:"), gutil.colors.gray(error.fileName));
    gutil.log(gutil.colors.magenta("Line Number:"), gutil.colors.gray(error.lineNumber));
};

const fileExists = (filePath, callback) => {
    fs.stat(filePath, error => {
        callback(error === null);
    });
};

const fileExistsSync = filePath => {
    try {
        fs.statSync(filePath);

        // It exists, otherwise an exception will have been thrown.
        return true;
    }
    catch (e) {
        return false;
    }
};

const removeTrailingSlash = value =>
    value.replace(/\/+$/, "");

const mergeWithArrayConcat = (object, ...sources) => {
    const customizer = (x, y) => {
        if (_.isArray(x)) {
            return x.concat(y);
        }
    };

    return _.mergeWith(object, ...sources, customizer);
};

/*******************************
 Exports
*******************************/

module.exports = {
    handleError,
    fileExists,
    fileExistsSync,
    removeTrailingSlash,
    mergeWithArrayConcat
};
