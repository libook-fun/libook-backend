/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  config.publicPath = '/public';

  config.frontend = {
    publicPath: '//cdn.libook.fun:8080/libook-static',
    version: '20191209'
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    mysql: {
      debug: true,
      client: {
        host: '127.0.0.1',
        port: '3306',
        user: 'test',
        password: 'test',
        database: 'libook',
        debug: false
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false
    },
    redis: {
      client: {
        host: '127.0.0.1', // Redis host
        port: 6479, // Redis port
        password: 'test',
        db: 0,
        weakDependent: true
      }
    }
  };

  return {
    ...config,
    ...userConfig
  };
};
