const fse = require('fs-extra');
module.exports = app => {
  const { config } = app;
  fse.ensureDir(config.static.dir + '/bucket');
  fse.ensureDir(config.static.dir + '/temp');
  const { publicPath, version } = config.frontend;
  app.locals = {
    getFullPath: function (path) {
      return `${publicPath}${path}?v=${version}`;
    },
    getPath: function (path) {
      return `${publicPath}${path}`;
    },
    getVersion: function () {
      return version;
    }
  };
  app.once('server', server => {
    // websocket
  });
  app.on('error', (err, ctx) => {
    // report error
  });
  app.on('request', ctx => {
    // log receive request
  });
  app.on('response', ctx => {
    // ctx.starttime is set by framework
    // const used = Date.now() - ctx.starttime;
    // log total cost
  });
};
