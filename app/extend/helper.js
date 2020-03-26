'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const pump = require('mz-modules/pump');
const sendToWormhole = require('stream-wormhole');

const HTTP_STATUS = {
  100: 'continue',
  101: 'switching protocols',
  102: 'processing',
  200: 'ok',
  201: 'created',
  202: 'accepted',
  203: 'non-authoritative information',
  204: 'no content',
  205: 'reset content',
  206: 'partial content',
  207: 'multi-status',
  208: 'already reported',
  226: 'im used',
  300: 'multiple choices',
  301: 'moved permanently',
  302: 'found',
  303: 'see other',
  304: 'not modified',
  305: 'use proxy',
  307: 'temporary redirect',
  308: 'permanent redirect',
  400: 'bad request',
  401: 'unauthorized',
  402: 'payment required',
  403: 'forbidden',
  404: 'not found',
  405: 'method not allowed',
  406: 'not acceptable',
  407: 'proxy authentication required',
  408: 'request timeout',
  409: 'conflict',
  410: 'gone',
  411: 'length required',
  412: 'precondition failed',
  413: 'payload too large',
  414: 'uri too long',
  415: 'unsupported media type',
  416: 'range not satisfiable',
  417: 'expectation failed',
  418: "I'm a teapot",
  422: 'unprocessable entity',
  423: 'locked',
  424: 'failed dependency',
  426: 'upgrade required',
  428: 'precondition required',
  429: 'too many requests',
  431: 'request header fields too large',
  500: 'internal server error',
  501: 'not implemented',
  502: 'bad gateway',
  503: 'service unavailable',
  504: 'gateway timeout',
  505: 'http version not supported',
  506: 'variant also negotiates',
  507: 'insufficient storage',
  508: 'loop detected',
  510: 'not extended',
  511: 'network authentication required'
};

const CODE_MESSAGE = {
  4000: '处理异常'
};

module.exports = {
  responeseJSON(ctx, options = {}, status) {
    if (status) {
      ctx.status = status;
    }
    const responese = {
      code: options.code || status || 200,
      message:
        options.message ||
        CODE_MESSAGE[options.code] ||
        HTTP_STATUS[status] ||
        'ok',
      data: options.data || undefined
    };
    ctx.body = responese;
  },
  primaryId(name = '') {
    return `${name.toLocaleUpperCase()}${moment().format('YYYYMMDDhhmmssSSS')}`;
  },
  primaryId2Path(id) {
    const name = id.replace(/\d/g, '');
    const date = id.replace(/\D/g, '');
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    return `/${name}/${year}/${month}/`;
  },
  getBook(basePath, book_id) {
    return `${basePath.replace(/\/$/, '')}/bucket${this.primaryId2Path(
      book_id
    )}${book_id}`;
  },
  getBookCoverPicture(basePath, book_id) {
    return `${basePath.replace(/\/$/, '')}/bucket${this.primaryId2Path(
      book_id
    )}${book_id}/${book_id}.png`;
  },
  getChapter(basePath, book_id, chapter_id) {
    return `${basePath.replace(/\/$/, '')}/bucket${this.primaryId2Path(
      book_id
    )}${book_id}/${chapter_id}.txt`;
  },
  getRecommenderPicture(basePath, recommender_id) {
    return `${basePath.replace(/\/$/, '')}/bucket${this.primaryId2Path(
      recommender_id
    )}${recommender_id}.png`;
  },
  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
  getPagination(ctx) {
    const { query = {} } = ctx;
    let { current, pageSize } = query;
    if (!current && !pageSize) {
      return null;
    }
    current = parseInt(current) ? parseInt(current) : 1;
    pageSize = parseInt(pageSize) ? parseInt(pageSize) : 20;
    return {
      limit: pageSize * 1,
      offset: (current - 1) * pageSize,
      current,
      pageSize
    };
  },
  async formData(ctx, fileParamNames = []) {
    const data = {};
    const parts = ctx.multipart();
    let part;
    while ((part = await parts()) != null) {
      if (part.length) {
        // 这是 busboy 的字段
        // console.log('field: ' + part[0]);
        // console.log('value: ' + part[1]);
        // console.log('valueTruncated: ' + part[2]);
        // console.log('fieldnameTruncated: ' + part[3]);
        if (part[1] !== 'undefined' && part[1] !== 'null') {
          data[part[0]] = part[1];
        }
      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
          // 需要做出处理，例如给出错误提示消息
          return;
        }
        if (!fileParamNames.includes(part.fieldname)) {
          await sendToWormhole(part);
          return;
        }
        // part 是上传的文件流
        // console.log('field: ' + part.fieldname);
        // console.log('filename: ' + part.filename);
        // console.log('encoding: ' + part.encoding);
        // console.log('mime: ' + part.mime);
        try {
          const filename =
            this.uuid() + path.extname(part.filename).toLowerCase();
          const target = path.join(this.config.static.dir, 'temp', filename);
          const writeStream = fs.createWriteStream(target);
          await pump(part, writeStream);
          data[part.fieldname] = target;
        } catch (err) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part);
        }
      }
    }
    // console.log(data);
    return data;
  },
  serverAddress: function (ctx, path) {
    const port = ctx.app.info.port || ctx.app.config.cluster.listen.port;
    return '//127.0.0.1:' + port + path;
  }
};
