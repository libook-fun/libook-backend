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

  config.proxy = true;

  config.name = 'libook';
  // 微信配置
  config.weixin = {
    appid: 'wx9da53e348afd2440',
    secret: '785157d770e61a5d1deeb8a0434e8eca'
  };
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1570058849158_6441';

  config.publicPath = (
    process.env.PUBLIC_BACKEND_PATH || 'http://localhost:7010/public'
  ).replace(/\/$/, '');

  config.libookGo = (
    process.env.LIBOOK_GO_PATH || 'http://localhost:7777'
  ).replace(/\/$/, '');

  config.frontend = {
    publicPath: (process.env.PUBLIC_PATH || '').replace(/\/$/, ''),
    version: '20191209'
  };

  // add your middleware config here   config.middleware = ['test'];
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'libook',
    view: {
      defaultViewEngine: 'nunjucks',
      mapping: {
        '.html': 'nunjucks'
      }
    },
    multipart: {
      fileExtensions: ['.txt']
    },
    security: {
      csrf: false
    },
    mysql: {
      debug: false,
      client: {
        host: process.env.MYSQL_HOST || '18.162.168.64',
        port: process.env.MYSQL_PORT || '3306',
        database: process.env.MYSQL_DATABASE || 'libook',
        user: process.env.MYSQL_USER || 'libook',
        password: process.env.MYSQL_PASSWORD || 'libook'
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false
    },
    redis: {
      client: {
        host: process.env.REDIS_HOST || '18.162.168.64', // Redis host
        port: process.env.REDIS_PORT || '6379', // Redis port
        password: process.env.REDIS_PASSWORD || 'libook',
        db: 0,
        weakDependent: true
      }
    },
    jwt: {
      secret: 'libook'
    },
    passportGithub: {
      key: '6041c554aed442365c2f',
      secret: '19b29aeb8d1b74e35d4197d131c5ad949eaee0ef'
    },
    io: {
      namespace: {
        '/': {
          connectionMiddleware: [],
          packetMiddleware: []
        }
      },
      namespace: {
        '/chat': {
          connectionMiddleware: [],
          packetMiddleware: []
        }
      }
    }
  };

  return {
    ...config,
    ...userConfig
  };
};
