const fse = require('fs-extra');
module.exports = app => {
  const { config } = app;
  fse.ensureDir(config.static.dir + '/bucket');
  fse.ensureDir(config.static.dir + '/temp');
  const { publicPath, version } = config.frontend;
  app.locals = {
    getFullPath: function(path) {
      return `${publicPath}${path}?v=${version}`;
    },
    getPath: function(path) {
      return `${publicPath}${path}`;
    },
    getVersion: function() {
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
  app.messenger.on('egg-ready', info => {
    app.info = info;
  });
  // app.passport.verify(async (ctx, user) => {
  //   console.log(user.name);
  //   // check user
  //   // assert(user.provider, 'user.provider should exists');
  //   // assert(user.id, 'user.id should exists');

  //   // find user from database
  //   //
  //   // Authorization Table
  //   // column   | desc
  //   // ---      | --
  //   // provider | provider name, like github, twitter, facebook, weibo and so on
  //   // uid      | provider unique id
  //   // user_id  | current application user id
  //   // const auth = await ctx.model.Authorization.findOne({
  //   //   uid: user.id,
  //   //   provider: user.provider
  //   // });
  //   // const existsUser = await ctx.model.User.findOne({ id: auth.user_id });
  //   // if (existsUser) {
  //   //   return existsUser;
  //   // }
  //   // // call user service to register a new user
  //   // const newUser = await ctx.service.user.register(user);
  //   // return newUser;
  //   return user;
  // });
};
