'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  routerPlus: {
    enable: true,
    package: 'egg-router-plus'
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks'
  },
  assets: {
    enable: false,
    package: 'egg-view-assets'
  },
  mysql: {
    enable: true,
    package: 'egg-mysql'
  },
  redis: {
    enable: true,
    package: 'egg-redis'
  },
  jwt: {
    enable: true,
    package: 'egg-jwt'
  },
  passport: {
    enable: true,
    package: 'egg-passport'
  },
  passportGithub: {
    enable: true,
    package: 'egg-passport-github'
  },
  io: {
    enable: true,
    package: 'egg-socket.io'
  }
};
