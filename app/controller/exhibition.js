'use strict';

const Controller = require('egg').Controller;

class ExhibitionController extends Controller {
  async create() {
    const { ctx } = this;
    const { service } = ctx;
    const { name } = ctx.request.body;
    if (!name) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误',
      });
      return;
    }
    const exhibition_id = await service.exhibition.create({
      name,
    });
    if (exhibition_id) {
      ctx.helper.responeseJSON(ctx, {
        data: {
          exhibition_id,
        },
      });
    } else {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
      });
    }
  }

  async update() {
    const { ctx } = this;
    const { service } = ctx;
    const { exhibition_id, name } = ctx.request.body;
    if (!exhibition_id || !name) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误',
      });
      return;
    }
    let exhibition = await service.exhibition.read({ exhibition_id });
    if (!exhibition) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: 'exhibition不存在',
      });
      return;
    }
    exhibition.name = name;
    exhibition = await service.exhibition.update(exhibition);
    if (exhibition) {
      ctx.helper.responeseJSON(ctx, {
        data: {
          exhibition_id
        },
      });
    } else {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
      });
    }
  }

  async read() {
    const { ctx } = this;
    const { query, service } = ctx;
    const { exhibition_id } = query;
    if (!exhibition_id) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误',
      });
      return;
    }
    const data = await service.exhibition.read({ exhibition_id });
    ctx.helper.responeseJSON(ctx, {
      data,
    });
  }

  async readAll() {
    const { ctx } = this;
    const { query, service } = ctx;
    const { name, order } = query;
    const where = {};
    if (name) where.name = name;
    const orders = order ? [JSON.parse(order)] : null;
    const data = await service.exhibition.readAll(
      where,
      orders,
      ctx.helper.getPagination(ctx)
    );
    ctx.helper.responeseJSON(ctx, {
      data,
    });
  }

  async delete() {
    const { ctx } = this;
    const { service } = ctx;
    const { exhibition_id } = ctx.request.body;
    if (!exhibition_id) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误',
      });
      return;
    }
    const recommender = await service.exhibition.read({ exhibition_id });
    if (!recommender) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '推荐不存在',
      });
      return;
    }
    const result = await service.exhibition.delete({ exhibition_id });
    if (result) {
      ctx.helper.responeseJSON(ctx, {
        data: {
          exhibition_id,
        },
      });
    } else {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
      });
    }
  }

  async index() {
    const { ctx, config } = this;
    const { query, service } = ctx;
    const { id } = query;
    const data = await service.exhibition.read({ exhibition_id: id });
    data.recommenders = await service.recommender.readAll({
      state: 1,
      type: 0,
      exhibition_id: data.exhibition_id
    });
    data.recommenders.forEach(recommender => {
      recommender.picture = ctx.helper.getBookCoverPicture(
        config.publicPath,
        recommender.book_id
      );
    });
    await ctx.render('exhibition/detail.html', {
      data,
    });
  }
}

module.exports = ExhibitionController;
