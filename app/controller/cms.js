'use strict';

const Controller = require('egg').Controller;

class CMSController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('cms/index.html');
  }
}

module.exports = CMSController;
