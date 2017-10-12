// BrowserSync doesn't works with a self signed certificate (because of Node TLS library), it must be configured
// to accept invalid certificate. http://stackoverflow.com/a/30438204/6805481
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/*******************************
 Setup
*******************************/

const gulp = require("gulp");
const url = require("url");
const proxy = require("proxy-middleware");
const browserSync = require("browser-sync");
const historyFallback = require("connect-history-api-fallback");

const host = "https://local.share-gate.com/";

/*******************************
 Browser Sync
*******************************/

const sync = callback => {
    const rootProxyOptions = url.parse(`${host}`);
    rootProxyOptions.route = "/";

    const apiProxyOptions = url.parse(`${host}api`);
    apiProxyOptions.route = "/api";

    const accountProxyOptions = url.parse(`${host}account`);
    accountProxyOptions.route = "/account";

    return browserSync({
        https: {
            pfx: "sgo.local.dev.pfx",
            passphrase: "gsoft123!"
        },
        online: false,
        open: false,
        port: 9000,
        server: {
            baseDir: [".", "dist"],
            middleware: [proxy(rootProxyOptions), proxy(apiProxyOptions), proxy(accountProxyOptions), historyFallback()]
        }
    }, callback);
};

/*******************************
 Exports
*******************************/

gulp.task("serve", ["build"], callback =>
    sync(callback));
