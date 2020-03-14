'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {
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
    const category_id = await service.category.create({
      name,
    });
    if (category_id) {
      ctx.helper.responeseJSON(ctx, {
        data: {
          category_id,
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
    const { category_id, name } = ctx.request.body;
    if (!category_id || !name) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误',
      });
      return;
    }
    let category = await service.category.read({ category_id });
    if (!category) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: 'category不存在',
      });
      return;
    }
    category.name = name;
    category = await service.category.update(category);
    if (category) {
      ctx.helper.responeseJSON(ctx, {
        data: {
          category_id,
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
    const { category_id } = query;
    if (!category_id) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误',
      });
      return;
    }
    const data = await service.category.read({ category_id });
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
    const orders = order ? [ JSON.parse(order) ] : null;
    const data = await service.category.readAll(
      where,
      orders,
      ctx.helper.getPagination(ctx)
    );
    ctx.helper.responeseJSON(ctx, {
      data,
    });
  }

  async index() {
    const { ctx } = this;
    const { query, service } = ctx;
    const { id } = query;
    const data = await service.category.read({ category_id: id });
    data.books = await service.book.readAll(
      { category_id: id, is_subbook: 0 },
      [[ 'updated_at', 'desc' ]]
    );
    await ctx.render('category/detail.html', {
      data,
    });
  }
}

module.exports = CategoryController;
