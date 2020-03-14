'use strict';

const fse = require('fs-extra');
const path = require('path');
const Controller = require('egg').Controller;

class ChapterController extends Controller {
  async create() {
    const { ctx } = this;
    const { service } = ctx;
    const formData = await ctx.helper.formData(ctx, ['file']);
    const { book_id, name, file } = formData;
    if (!name || !book_id || !file) {
      file && (await fse.remove(file));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    const book = await service.book.read({ book_id });
    if (!book) {
      file && (await fse.remove(file));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: 'book不存在'
      });
      return;
    }
    try {
      const chapter_id = await service.chapter.create({
        book_id,
        name
      });
      if (chapter_id && file) {
        const basePath = this.config.static.dir;
        const chapterFilename = ctx.helper.getChapter(
          basePath,
          book_id,
          chapter_id
        );
        await fse.move(file, chapterFilename, {
          overwrite: true
        });
      }
      ctx.helper.responeseJSON(ctx, {
        data: {
          chapter_id
        }
      });
    } catch (error) {
      file && (await fse.remove(file));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: error.message
      });
    }
  }

  async update() {
    const { ctx } = this;
    const { service } = ctx;
    const formData = await ctx.helper.formData(ctx, ['file']);
    const { chapter_id, book_id, name, file } = formData;
    if (!chapter_id) {
      file && (await fse.remove(file));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    let chapter = await service.chapter.read({ chapter_id });
    if (!chapter) {
      file && (await fse.remove(file));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '章节不存在'
      });
      return;
    }
    chapter.book_id = book_id ? book_id : chapter.book_id;
    chapter.name = name ? name : chapter.name;
    try {
      chapter = await service.chapter.update(chapter);
      if (chapter && file) {
        const basePath = this.config.static.dir;
        const chapterFilename = ctx.helper.getChapter(
          basePath,
          chapter.book_id,
          chapter.chapter_id
        );
        await fse.move(file, chapterFilename, {
          overwrite: true
        });
      }
      ctx.helper.responeseJSON(ctx, {
        data: {
          chapter_id
        }
      });
    } catch (error) {
      file && (await fse.remove(file));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: error.message
      });
    }
  }

  async read() {
    const { ctx } = this;
    const { query, service } = ctx;
    const { chapter_id } = query;
    if (!chapter_id) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    const data = await service.chapter.readBetter({ chapter_id });
    ctx.helper.responeseJSON(ctx, {
      data
    });
  }

  async readAll() {
    const { ctx } = this;
    const { query, service } = ctx;
    const { book_id, name, order } = query;
    if (!book_id) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    const where = {};
    if (book_id) where.book_id = book_id;
    if (name) where.name = name;
    const orders = order ? [JSON.parse(order)] : null;
    const data = await service.chapter.readAll(
      where,
      orders,
      ctx.helper.getPagination(ctx)
    );
    ctx.helper.responeseJSON(ctx, {
      data
    });
  }

  async index() {
    const { ctx, config } = this;
    const { query, service } = ctx;
    const { id } = query;
    const data = await service.chapter.readThree({ chapter_id: id });
    const result = await ctx.curl(
      ctx.helper.getChapter(
        'http://127.0.0.1:7001/public/',
        data.book_id,
        data.chapter_id
      ),
      {
        dataType: 'text'
      }
    );
    data.content = result.data;
    const res = {
      data,
      url: ctx.helper.getChapter(
        config.publicPath,
        data.book_id,
        data.chapter_id
      )
    };
    await ctx.render('chapter/detail.html', res);
  }
}

module.exports = ChapterController;
