'use strict';

const Service = require('egg').Service;

class SubbookService extends Service {
  async create(data = {}) {
    const { mysql } = this.app;
    const { parent_id, book_id, name } = data;
    const bind_id = this.ctx.helper.primaryId('subbook');
    const result = await mysql.insert('tr_book_subbook', {
      bind_id,
      parent_id,
      book_id,
      name,
    });
    if (result.affectedRows === 1) {
      return bind_id;
    }
    return null;
  }

  async update(data) {
    const { mysql } = this.app;
    const result = await mysql.update('tr_book_subbook', data, {
      where: { bind_id: data.bind_id },
    });
    if (result.affectedRows === 1) {
      return data;
    }
    return null;
  }

  // 获取 subbook
  async read(where) {
    const { mysql } = this.app;
    const book = await mysql.get('tr_book_subbook', where);
    return book;
  }

  // 获取 所有 subbook
  async readAll(where, orders, pagination) {
    const { mysql } = this.app;
    const options = { where, orders, ...pagination };
    const books = await mysql.select('v_book_subbook_view', options);
    if (pagination) {
      const total = await this.count(where);
      return {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total,
        dataSource: books,
      };
    }
    return books;
  }

  // 获取 所有可用 subbook
  async availableSubbooks() {
    const { mysql } = this.app;
    const books = await mysql.query(
      'SELECT * FROM `v_book_subbook_view` WHERE `is_subbook` = 1 AND `bind_id` is null'
    );
    return books;
  }

  // 获取 subbook数量
  async count(where) {
    const { mysql } = this.app;
    const count = await mysql.count('tr_book_subbook', where);
    return count;
  }

  // 删除 subbook
  async delete(where) {
    const { mysql } = this.app;
    const result = await mysql.delete('tr_book_subbook', where);
    if (result.affectedRows === 1) {
      return result;
    }
    return null;
  }
}

module.exports = SubbookService;
