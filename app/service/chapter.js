'use strict';

const Service = require('egg').Service;

class ChapterService extends Service {
  async create(data = {}) {
    const { mysql } = this.app;
    const { service } = this.ctx;
    const { name, book_id } = data;
    const last = await this.readLast(book_id);
    const chapter_id = this.ctx.helper.primaryId('chapter');
    const chapter = {
      chapter_id,
      name,
      book_id,
      index: last ? last.index + 1 : 0,
    };
    const result = await mysql.insert('t_book_chapter', chapter);
    if (result.affectedRows === 1) {
      await service.book.update({
        book_id,
        active_chapter_id: chapter_id,
      });
      return chapter_id;
    }
    return null;
  }

  async update(data) {
    const { mysql } = this.app;
    const { service } = this.ctx;
    const result = await mysql.update('t_book_chapter', data, {
      where: { chapter_id: data.chapter_id },
    });
    if (result.affectedRows === 1) {
      await service.book.update({
        book_id: data.book_id,
        active_chapter_id: data.chapter_id,
      });
      return data;
    }
    return null;
  }

  async read(where) {
    const { mysql } = this.app;
    const chapter = await mysql.get('t_book_chapter', where);
    return chapter;
  }

  // id 获取 chapter
  async readBetter(where) {
    const { service } = this.ctx;
    const chapter = await this.read(where);
    if (chapter) {
      const book = await service.book.readBetter({ book_id: chapter.book_id });
      chapter.book = book;
    }
    return chapter;
  }

  // bookid + index 获取 chapter
  async readByBook(book_id, index) {
    const { mysql } = this.app;
    const { service } = this.ctx;
    const chapter = await mysql.get('t_book_chapter', { book_id, index });
    if (chapter) {
      const book = await service.book.readBetter({ book_id: chapter.book_id });
      chapter.book = book;
    }
    return chapter;
  }

  // id 获取 chapter（包含前一章和后一章）
  async readThree(where) {
    const chapter = await this.readBetter(where);
    if (chapter) {
      const { book_id, index } = chapter;
      chapter.last = await this.readByBook(book_id, index - 1);
      chapter.next = await this.readByBook(book_id, index + 1);
    }
    return chapter;
  }

  // bookid + index 获取 chapter（包含前一章和后一章）
  async readByBookThree(book_id, index) {
    const chapter = await this.readByBook(book_id, index);
    if (chapter) {
      const { book_id, index } = chapter;
      chapter.last = await this.readByBook(book_id, index - 1);
      chapter.next = await this.readByBook(book_id, index + 1);
    }
    return chapter;
  }

  // bookid 获取 第一个 chapter
  async readFirst(book_id) {
    const { mysql } = this.app;
    const data = await mysql.select('t_book_chapter', {
      where: { book_id },
      orders: [[ 'index', 'asc' ]],
      limit: 1,
    });
    return data[0];
  }

  // bookid 获取 最后一个 chapter
  async readLast(book_id) {
    const { mysql } = this.app;
    const data = await mysql.select('t_book_chapter', {
      where: { book_id },
      orders: [[ 'index', 'desc' ]],
      limit: 1,
    });
    return data[0];
  }

  // bookid 获取 所有 chapter
  async readAll(where, orders, pagination) {
    const { mysql } = this.app;
    const options = { where, orders, ...pagination };
    const chapters = await mysql.select('t_book_chapter', options);
    if (pagination) {
      const total = await this.count(where);
      return {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total,
        dataSource: chapters,
      };
    }
    return chapters;
  }

  // 获取 chapter数量
  async count(where) {
    const { mysql } = this.app;
    const count = await mysql.count('t_book_chapter', where);
    return count;
  }

  async delete(where) {
    const { mysql } = this.app;
    const result = await mysql.delete('t_book_chapter', where);
    if (result.affectedRows === 1) {
      return result;
    }
    return null;
  }
}

module.exports = ChapterService;
