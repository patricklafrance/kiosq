/*******************************
 Setup
*******************************/

const minimist = require("minimist");

/*******************************
 Export
*******************************/

const options = minimist(process.argv.slice(2), {
    string: ["env", "platform"],
    default: {
        env: process.env.NODE_ENV || "development"
    }
});

/* eslint-disable no-process-env */
module.exports = {
    isDevelopment: options.env === "development",
    isRelease: options.env === "production",
    version: new Date().getTime() * 10000 + 621355968000000000
};
/* eslint-enable no-process-env */

