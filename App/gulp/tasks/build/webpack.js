/*******************************
 Setup
*******************************/

const exec = require("child_process").exec;
const path = require("path");

const paths = require("../../paths.js");
const env = require("../../env.js");

/*******************************
 Functions
*******************************/

const executeWebpack = (instructions, done) => {
    const currentDirectory = path.resolve(process.cwd());
    const executablePath = path.resolve(`${currentDirectory}/${paths.nodeRoot}.bin/webpack`);

    let command = `${executablePath} --config ${instructions.configurationFile} --progress`;

    if (env.isRelease) {
        command += " -p --env.production";
    }

    exec(command, error => {
        done(error);
    });
};

/*******************************
 Export
*******************************/

module.exports = {
    executeWebpack
};
