/*******************************
 Setup
*******************************/

const path = require("path");
const through = require("through2");
const glob = require("glob");
const slash = require("slash");
const _ = require("lodash");

/*******************************
 Glob import
*******************************/

function sassGlobImport() {
    return through.obj(transform);
}

function transform(file, env, callback) {
    const basePath = path.normalize(path.join(path.dirname(file.path), "/"));
    const contents = file.contents.toString("utf-8");
    const importRulesToIgnore = getNonGlobImportRules(contents);
    const globImportRules = getGlobImportRules(contents);
    const transformedGlobImportRules = globImportRules.map(globImportRule => transformGlobImportRule(globImportRule[0], globImportRule[1], file, basePath, importRulesToIgnore));

    let transformedContents = contents;

    transformedGlobImportRules.forEach(transformedImportRule => {
        transformedContents = transformedContents.replace(transformedImportRule.original, transformedImportRule.transformed);
    });

    file.contents = new Buffer(transformedContents);
    callback(null, file);
}

function getNonGlobImportRules(contents) {
    const matches = getMatches(contents, /^\s*@import\s+["']([^*"']+)["'];?$/gm);

    return matches.map(importRule => {
        let result = importRule[1];

        if (!result.endsWith(".scss")) {
            result += ".scss";
        }

        return slash(result);
    });
}

function getGlobImportRules(contents) {
    return getMatches(contents, /^\s*@import\s+["']([^"']+\*)["'];?$/gm);
}

function getMatches(contents, regex) {
    const matches = [];
    let match = null;

    do {
        match = regex.exec(contents);

        if (match !== null && match.length > 0) {
            matches.push(match);
        }
    }
    while (match !== null);

    return matches;
}

function transformGlobImportRule(importRule, globPattern, file, basePath, importRulesToIgnore) {
    const pattern = path.join(basePath, globPattern.endsWith(".scss") ? globPattern : `${globPattern}.scss`);
    const matchingFiles = glob.sync(pattern, {
        cwd: basePath
    });

    const newImports = [];

    matchingFiles.forEach(filename => {
        if (filename !== file.path) {
            // Remove parent base path.
            const normalizedFilename = path.normalize(filename).replace(basePath, "");

            newImports.push(slash(normalizedFilename));
        }
    });

    return {
        original: importRule,
        transformed: _(newImports)
            .difference(importRulesToIgnore)
            .map(newImport => `@import "${slash(newImport)}";`).join("\r\n")
    };
}

/*******************************
 Exports
*******************************/

module.exports = sassGlobImport;