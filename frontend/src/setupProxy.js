const { createProxyMiddleware } = require("http-proxy-middleware");

console.log("Proxy loaded");

const projectId = "eduverse-c818a";
const region = "us-central1";

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://127.0.0.1:5008",
      changeOrigin: true,
      pathRewrite: {
        "^/api": `/${projectId}/${region}/vlab`,
      },
      logLevel: "debug",
    })
  );
};