'use strict';

const fse = require('fs-extra');
const path = require('path');
const Controller = require('egg').Controller;

class RecommenderController extends Controller {
  async create() {
    const { ctx } = this;
    const { service } = ctx;
    const formData = await ctx.helper.formData(ctx, ['pic']);
    const { book_id, name, type, description, pic, exhibition_id } = formData;
    if (!book_id || !name || !type) {
      pic && (await fse.remove(pic));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    if (type == 0 && !exhibition_id) {
      pic && (await fse.remove(pic));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    const book = await service.book.read({ book_id });
    if (!book) {
      pic && (await fse.remove(pic));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: 'book不存在'
      });
      return;
    }
    try {
      const recommender_id = await service.recommender.create({
        book_id,
        type,
        name,
        description,
        exhibition_id
      });
      if (pic) {
        const basePath = this.config.static.dir;
        const recommenderPicture = ctx.helper.getRecommenderPicture(
          basePath,
          recommender_id
        );
        await fse.move(pic, recommenderPicture, {
          overwrite: true
        });
      }
      ctx.helper.responeseJSON(ctx, {
        data: {
          recommender_id
        }
      });
    } catch (error) {
      pic && (await fse.remove(pic));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: error.message
      });
    }
  }

  async update() {
    const { ctx } = this;
    const { service } = ctx;
    const formData = await ctx.helper.formData(ctx, ['pic']);
    const {
      recommender_id,
      book_id,
      name,
      type,
      description,
      pic,
      exhibition_id
    } = formData;
    if (!recommender_id) {
      pic && (await fse.remove(pic));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    if (type == 0 && !exhibition_id) {
      pic && (await fse.remove(pic));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    let recommender = await service.recommender.read({ recommender_id });
    if (!recommender) {
      pic && (await fse.remove(pic));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '推荐不存在'
      });
      return;
    }
    recommender.book_id = book_id ? book_id : recommender.book_id;
    recommender.name = name ? name : recommender.name;
    recommender.type = type ? type : recommender.type;
    recommender.exhibition_id = exhibition_id
      ? exhibition_id
      : recommender.exhibition_id;
    recommender.description = description
      ? description
      : recommender.description;
    try {
      recommender = await service.recommender.update(recommender);
      if (recommender_id > -1 && pic) {
        const basePath = this.config.static.dir;
        const recommenderPicture = ctx.helper.getRecommenderPicture(
          basePath,
          recommender.recommender_id
        );
        await fse.move(pic, recommenderPicture, {
          overwrite: true
        });
      }
      ctx.helper.responeseJSON(ctx, {
        data: {
          recommender_id
        }
      });
    } catch (error) {
      pic && (await fse.remove(pic));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: error.message
      });
    }
  }

  async active() {
    const { ctx } = this;
    const { service } = ctx;
    let { recommender_id } = ctx.request.body;
    if (!recommender_id) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    const recommender = await service.recommender.read({ recommender_id });
    if (!recommender) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '推荐不存在'
      });
      return;
    }
    recommender_id = await service.recommender.active(recommender_id);
    if (recommender_id) {
      ctx.helper.responeseJSON(ctx, {
        data: {
          recommender_id
        }
      });
    } else {
      ctx.helper.responeseJSON(ctx, {
        code: 4000
      });
    }
  }

  async disable() {
    const { ctx } = this;
    const { service } = ctx;
    let { recommender_id } = ctx.request.body;
    if (!recommender_id) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    const recommender = await service.recommender.read({ recommender_id });
    if (!recommender) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '推荐不存在'
      });
      return;
    }
    recommender_id = await service.recommender.disable(recommender_id);
    if (recommender_id) {
      ctx.helper.responeseJSON(ctx, {
        data: {
          recommender_id
        }
      });
    } else {
      ctx.helper.responeseJSON(ctx, {
        code: 4000
      });
    }
  }

  async read() {
    const { ctx } = this;
    const { query, service } = ctx;
    const { recommender_id } = query;
    if (!recommender_id) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    const data = await service.recommender.readBetter({ recommender_id });
    ctx.helper.responeseJSON(ctx, {
      data
    });
  }

  async readAll() {
    const { ctx } = this;
    const { query, service } = ctx;
    const { type, state, exhibition_id, order } = query;
    const where = {};
    if (type) where.type = type;
    if (state) where.state = state;
    if (exhibition_id) where.exhibition_id = exhibition_id;
    const orders = order ? [JSON.parse(order)] : null;
    const data = await service.recommender.readAll(
      where,
      orders,
      ctx.helper.getPagination(ctx)
    );
    ctx.helper.responeseJSON(ctx, {
      data
    });
  }

  async delete() {
    const { ctx } = this;
    const { service } = ctx;
    const { recommender_id } = ctx.request.body;
    if (!recommender_id) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    const recommender = await service.recommender.read({ recommender_id });
    if (!recommender) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '推荐不存在'
      });
      return;
    }
    const result = await service.recommender.delete({ recommender_id });
    if (result) {
      ctx.helper.responeseJSON(ctx, {
        data: {
          recommender_id
        }
      });
    } else {
      ctx.helper.responeseJSON(ctx, {
        code: 4000
      });
    }
  }
}

module.exports = RecommenderController;
