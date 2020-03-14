'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {
  async create(data = {}) {
    const { mysql } = this.app;
    const { name } = data;
    const category_id = this.ctx.helper.primaryId('category');
    const result = await mysql.insert('t_book_category', {
      category_id,
      name,
    });
    if (result.affectedRows === 1) {
      return category_id;
    }
    return null;
  }

  async update(data) {
    const { mysql } = this.app;
    const result = await mysql.update('t_book_category', data, {
      where: { category_id: data.category_id },
    });
    if (result.affectedRows === 1) {
      return data;
    }
    return null;
  }

  // id 获取 category
  async read(where) {
    const { mysql } = this.app;
    const category = await mysql.get('t_book_category', where);
    return category;
  }

  // 获取 所有 category
  async readAll(where, orders, pagination) {
    const { mysql } = this.app;
    const options = { where, orders, ...pagination };
    const categorys = await mysql.select('t_book_category', options);
    if (pagination) {
      const total = await this.count(where);
      return {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total,
        dataSource: categorys,
      };
    }
    return categorys;
  }

  // 获取 所有 category
  async count(where) {
    const { mysql } = this.app;
    const count = await mysql.count('t_book_category', where);
    return count;
  }

  async delete(where) {
    const { mysql } = this.app;
    const result = await mysql.delete('t_book_category', where);
    if (result.affectedRows === 1) {
      return result;
    }
    return null;
  }
}

module.exports = CategoryService;
