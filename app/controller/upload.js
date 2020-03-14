'use strict';
const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const pump = require('mz-modules/pump');
// const sendToWormhole = require('stream-wormhole');

class UploadController extends Controller {
  async upload() {
    const { ctx, config } = this;
    // https://github.com/eggjs/examples/tree/master/multipart
    const stream = await ctx.getFileStream();
    // console.log(stream.fieldname);
    const filename = encodeURIComponent(stream.fields.name || stream.filename);
    const target = path.join(config.static.dir, filename);
    // console.log(target);
    const writeStream = fs.createWriteStream(target);
    await pump(stream, writeStream);
    ctx.redirect(config.publicPath.replace(/\/$/, '') + '/' + filename);
  }

  async upload2() {
    const { ctx } = this;
    const data = await ctx.helper.formData(ctx);
    ctx.helper.responeseJSON(ctx, {
      code: 4000,
      message: 'sss'
    });
  }
}

module.exports = UploadController;
