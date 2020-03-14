'use strict';

const Service = require('egg').Service;

class ExhibitionService extends Service {
  async create(data = {}) {
    const { mysql } = this.app;
    const { name } = data;
    const exhibition_id = this.ctx.helper.primaryId('exhibition');
    const result = await mysql.insert('t_book_exhibition', {
      exhibition_id,
      name,
    });
    if (result.affectedRows === 1) {
      return exhibition_id;
    }
    return null;
  }

  async update(data) {
    const { mysql } = this.app;
    const result = await mysql.update('t_book_exhibition', data, {
      where: { exhibition_id: data.exhibition_id },
    });
    if (result.affectedRows === 1) {
      return data;
    }
    return null;
  }

  async read(where) {
    const { mysql } = this.app;
    const exhibition = await mysql.get('t_book_exhibition', where);
    return exhibition;
  }

  // 获取 所有 exhibition
  async readAll(where, orders, pagination) {
    const { mysql } = this.app;
    const options = { where, orders, ...pagination };
    const exhibitions = await mysql.select('t_book_exhibition', options);
    if (pagination) {
      const total = await this.count(where);
      return {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total,
        dataSource: exhibitions,
      };
    }
    return exhibitions;
  }

  // 获取 exhibition数量
  async count(where) {
    const { mysql } = this.app;
    const count = await mysql.count('t_book_exhibition', where);
    return count;
  }

  // 删除书籍，会删除所有相关联的推荐
  async delete(where) {
    const { mysql } = this.app;
    const { service } = this.ctx;
    const result = await mysql.delete('t_book_exhibition', where);
    if (result.affectedRows === 1) {
      await service.recommender.delete({
        exhibition_id: where.exhibition_id,
      });
      return result;
    }
    return null;
  }
}

module.exports = ExhibitionService;
