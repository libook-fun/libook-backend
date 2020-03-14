'use strict';

const Controller = require('egg').Controller;

class WeixinController extends Controller {
  /**
   * 相关文档：https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
   * openid 唯一
   * session_key 每次都在变
   */
  async login() {
    const { ctx, config } = this;
    const { query } = ctx;
    const { code } = query;
    const { appid, secret } = config.weixin;
    if (!code) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    const result = await ctx.curl(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
      {
        dataType: 'json'
      }
    );
    if (result.data && result.data.errcode) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: result.data.errmsg
      });
    } else {
      ctx.helper.responeseJSON(ctx, {
        data: result.data
      });
    }
  }
}

module.exports = WeixinController;
