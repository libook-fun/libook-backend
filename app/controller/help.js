'use strict';

const Controller = require('egg').Controller;

class HelpController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('help/index.html');
  }
}

module.exports = HelpController;
