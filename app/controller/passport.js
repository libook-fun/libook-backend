'use strict';

const Controller = require('egg').Controller;
class PassportController extends Controller {
  async login() {
    const { ctx, app, config } = this;
    const { account, password } = ctx.request.body;
    // 验证user表 取出userid等信息，放入token中
    const token = app.jwt.sign(
      {
        account,
        loginTime: +new Date()
      },
      config.jwt.secret
    );
    ctx.body = token;
  }

  async register() {
    const { ctx, app, config } = this;
    const { account, password } = ctx.request.body;
    const token = app.jwt.sign(
      {
        account,
        password
      },
      config.jwt.secret
    );
    ctx.body = token;
  }
}

module.exports = PassportController;
