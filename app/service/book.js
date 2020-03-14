'use strict';

const Service = require('egg').Service;

class BookService extends Service {
  async create(data = {}) {
    const { mysql } = this.app;
    const { category_id, name, author, description, is_subbook } = data;
    const book_id = this.ctx.helper.primaryId('book');
    const result = await mysql.insert('t_book', {
      book_id,
      category_id,
      name,
      author,
      description,
      is_subbook,
    });
    if (result.affectedRows === 1) {
      return book_id;
    }
    return null;
  }

  async update(data) {
    const { mysql } = this.app;
    const result = await mysql.update('t_book', data, {
      where: { book_id: data.book_id },
    });
    if (result.affectedRows === 1) {
      return data;
    }
    return null;
  }

  // id 获取 book
  async read(where) {
    const { mysql } = this.app;
    const book = await mysql.get('t_book', where);
    return book;
  }

  // id 获取 book
  async readBetter(where) {
    const { service } = this.ctx;
    const book = await this.read(where);
    if (book) {
      const category = await service.category.read({
        category_id: book.category_id,
      });
      book.category = category;
      const activeChapter = await service.chapter.read({
        chapter_id: book.active_chapter_id,
      });
      book.activeChapter = activeChapter ? activeChapter : null;
    }
    return book;
  }

  // 获取 所有 book
  async readAll(where, orders, pagination) {
    const { mysql } = this.app;
    const options = { where, orders, ...pagination };
    const books = await mysql.select('t_book', options);
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

  // 获取 book数量
  async count(where) {
    const { mysql } = this.app;
    const count = await mysql.count('t_book', where);
    return count;
  }

  // 删除书籍，会删除所有章节和推荐 尽量慎用
  async delete(where) {
    const { mysql } = this.app;
    const { service } = this.ctx;
    const result = await mysql.delete('t_book', where);
    if (result.affectedRows === 1) {
      await service.chapter.delete({ book_id: where.id });
      await service.recommender.delete({ book_id: where.id });
      return result;
    }
    return null;
  }

  async subbooks(parent_id) {
    const { service } = this.ctx;
    const subbooks = await service.subbook.readAll({
      parent_id,
    });
    return subbooks;
  }

  async parentbook(book_id) {
    const { service } = this.ctx;
    const subbook = await service.subbook.read({
      book_id,
    });
    return subbook;
  }
}

module.exports = BookService;
