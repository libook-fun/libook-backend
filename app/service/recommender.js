'use strict';

const Service = require('egg').Service;

class RecommenderService extends Service {
  async create(data = {}) {
    const { mysql } = this.app;
    const { service } = this.ctx;
    const { book_id, name, type, description, exhibition_id } = data;
    const recommender_id = this.ctx.helper.primaryId('recommender');
    const result = await mysql.insert('t_book_recommender', {
      recommender_id,
      book_id,
      name,
      type,
      description,
      exhibition_id,
    });
    if (result.affectedRows === 1) {
      exhibition_id &&
        (await service.exhibition.update({
          exhibition_id,
          active_recommender_id: recommender_id,
        }));
      return recommender_id;
    }
    return null;
  }

  async active(recommender_id) {
    const { mysql } = this.app;
    const result = await mysql.update(
      't_book_recommender',
      {
        state: 1,
      },
      {
        where: {
          recommender_id,
        },
      }
    );
    if (result.affectedRows === 1) {
      return recommender_id;
    }
    return null;
  }

  async disable(recommender_id) {
    const { mysql } = this.app;
    const result = await mysql.update(
      't_book_recommender',
      {
        state: 0,
      },
      {
        where: {
          recommender_id,
        },
      }
    );
    if (result.affectedRows === 1) {
      return recommender_id;
    }
    return null;
  }

  async update(data) {
    const { mysql } = this.app;
    const { service } = this.ctx;
    const result = await mysql.update('t_book_recommender', data, {
      where: {
        recommender_id: data.recommender_id,
      },
    });
    if (result.affectedRows === 1) {
      data.exhibition_id &&
        (await service.exhibition.update({
          exhibition_id: data.exhibition_id,
          active_recommender_id: data.recommender_id,
        }));
      return data;
    }
    return null;
  }

  async read(where) {
    const { mysql } = this.app;
    const recommender = await mysql.get('t_book_recommender', where);
    return recommender;
  }

  async readBetter(where) {
    const { service } = this.ctx;
    const recommender = await this.read(where);
    if (recommender) {
      const book = await service.book.readBetter({
        book_id: recommender.book_id,
      });
      recommender.book = book;
    }
    return recommender;
  }

  // 获取 所有 recommender
  async readAll(where, orders, pagination) {
    const { mysql } = this.app;
    const options = { where, orders, ...pagination };
    const recommenders = await mysql.select('t_book_recommender', options);
    if (pagination) {
      const total = await this.count(where);
      return {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total,
        dataSource: recommenders,
      };
    }
    return recommenders;
  }

  // 获取 recommender数量
  async count(where) {
    const { mysql } = this.app;
    const count = await mysql.count('t_book_recommender', where);
    return count;
  }

  async delete(where) {
    const { mysql } = this.app;
    const result = await mysql.delete('t_book_recommender', where);
    if (result.affectedRows === 1) {
      return result;
    }
    return null;
  }
}

module.exports = RecommenderService;
