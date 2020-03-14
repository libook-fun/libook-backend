'use strict';

const fs = require('fs');
const path = require('path');
const Service = require('egg').Service;
const pump = require('mz-modules/pump');

// https://github.com/eggjs/examples/tree/master/multipart

class UploadService extends Service {
  async upload() {
    const { config, ctx } = this;
    const stream = await ctx.getFileStream();
    const filename = encodeURIComponent(stream.fields.name || stream.filename);
    const target = path.join(config.static.dir, filename);
    const writeStream = fs.createWriteStream(target);
    await pump(stream, writeStream);
  }
}

module.exports = UploadService;
