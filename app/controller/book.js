'use strict';

const fse = require('fs-extra');
const path = require('path');
const Controller = require('egg').Controller;

class BookController extends Controller {
  async create() {
    const { ctx } = this;
    const { service } = ctx;
    const formData = await ctx.helper.formData(ctx, ['file']);
    const { category_id, name, file } = formData;
    if (!category_id || !name) {
      file && (await fse.remove(file));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    const category = await service.category.read({ category_id });
    if (!category) {
      file && (await fse.remove(file));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '分类不存在'
      });
      return;
    }
    const { author, description, is_subbook } = formData;
    try {
      const book_id = await service.book.create({
        category_id,
        name,
        author,
        description,
        is_subbook
      });
      if (book_id && file) {
        const basePath = this.config.static.dir;
        const bookDirectory = ctx.helper.getBook(basePath, book_id);
        await fse.ensureDir(bookDirectory);
        const bookCoverPicture = ctx.helper.getBookCoverPicture(
          basePath,
          book_id
        );
        await fse.move(file, bookCoverPicture, {
          overwrite: true
        });
      }
      ctx.helper.responeseJSON(ctx, {
        data: {
          book_id
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
    const {
      book_id,
      category_id,
      name,
      author,
      description,
      is_subbook,
      file
    } = formData;
    if (!book_id) {
      file && (await fse.remove(file));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    let book = await service.book.read({ book_id });
    if (!book) {
      file && (await fse.remove(file));
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: 'book不存在'
      });
      return;
    }
    if (is_subbook == 1) {
      // 如果可以作为丛书，先看是否已经被绑定成主书
      const parentbook = await service.subbook.read({ parent_id: book_id });
      if (parentbook) {
        file && (await fse.remove(file));
        ctx.helper.responeseJSON(ctx, {
          code: 4000,
          message: 'book已经被绑定成主书，请删除所有丛书的绑定后再修改'
        });
        return;
      }
    }
    if (is_subbook == 0) {
      // 如果可以作为主书，先看是否已经被绑定成丛书
      const subbook = await service.subbook.read({ book_id });
      if (subbook) {
        file && (await fse.remove(file));
        ctx.helper.responeseJSON(ctx, {
          code: 4000,
          message: 'book已经被绑定成丛书，请解绑后再修改'
        });
        return;
      }
    }
    book.category_id = category_id ? category_id : book.category_id;
    book.name = name ? name : book.name;
    book.author = author ? author : book.author;
    book.description = description ? description : book.description;
    book.is_subbook = is_subbook ? is_subbook : book.is_subbook;
    try {
      book = await service.book.update(book);
      if (book && file) {
        const basePath = this.config.static.dir;
        const bookDirectory = ctx.helper.getBook(basePath, book_id);
        await fse.ensureDir(bookDirectory);
        const bookCoverPicture = ctx.helper.getBookCoverPicture(
          basePath,
          book_id
        );
        await fse.move(file, bookCoverPicture, {
          overwrite: true
        });
        ctx.helper.responeseJSON(ctx, {
          data: {
            book_id
          }
        });
      }
      ctx.helper.responeseJSON(ctx, {
        data: {
          book_id
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
    const { book_id } = query;
    if (!book_id) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    const data = await service.book.readBetter({ book_id });
    ctx.helper.responeseJSON(ctx, {
      data
    });
  }

  async readAll() {
    const { ctx } = this;
    const { query, service } = ctx;
    const { category_id, name, author, is_subbook, order } = query;
    const where = {};
    if (category_id) where.category_id = category_id;
    if (name) where.name = name;
    if (author) where.author = author;
    if (is_subbook) where.is_subbook = is_subbook;
    const orders = order ? [JSON.parse(order)] : undefined;
    const data = await service.book.readAll(
      where,
      orders,
      ctx.helper.getPagination(ctx)
    );
    ctx.helper.responeseJSON(ctx, {
      data
    });
  }

  async subbooks() {
    const { ctx } = this;
    const { query, service } = ctx;
    const { parent_id, is_subbook } = query;
    const where = {};
    if (parent_id) where.parent_id = parent_id;
    if (is_subbook) where.is_subbook = is_subbook;
    const data = await service.subbook.readAll(where);
    ctx.helper.responeseJSON(ctx, {
      data
    });
  }

  async availableSubbooks() {
    const { ctx } = this;
    const { service } = ctx;
    const data = await service.subbook.availableSubbooks();
    ctx.helper.responeseJSON(ctx, {
      data
    });
  }

  async parentbook() {
    const { ctx } = this;
    const { query, service } = ctx;
    const { book_id } = query;
    if (!book_id) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    const data = await service.subbook.read({
      book_id
    });
    ctx.helper.responeseJSON(ctx, {
      data
    });
  }

  async bind() {
    const { ctx } = this;
    const { service } = ctx;
    const { parent_id, book_id, name } = ctx.request.body;
    if (!parent_id || !book_id || !name) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    if (parent_id == book_id) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '不能绑定自己'
      });
      return;
    }
    const book = await service.book.read({ book_id });
    if (!book) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '丛书不存在'
      });
      return;
    }
    if (book && book.is_subbook == 0) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '丛书不支持绑定'
      });
      return;
    }
    const parentBook = await service.book.read({ book_id: parent_id });
    if (!parentBook) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '主书不存在'
      });
      return;
    }
    const subbook = await service.subbook.read({
      book_id
    });
    if (subbook) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '当前绑定丛书已存在绑定关系，无法继续绑定'
      });
      return;
    }
    const id = await service.subbook.create({
      parent_id,
      book_id,
      name
    });
    if (id) {
      ctx.helper.responeseJSON(ctx, {
        data: {
          id
        }
      });
    } else {
      ctx.helper.responeseJSON(ctx, {
        code: 4000
      });
    }
  }

  async unbind() {
    const { ctx } = this;
    const { service } = ctx;
    const { parent_id, book_id } = ctx.request.body;
    if (!parent_id || !book_id) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '参数错误'
      });
      return;
    }
    const parentBook = await service.book.read({ book_id: parent_id });
    if (!parentBook) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '主书不存在'
      });
      return;
    }
    const book = await service.book.read({ book_id });
    if (!book) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '丛书不存在'
      });
      return;
    }
    const subbook = await service.subbook.read({
      book_id
    });
    if (!subbook) {
      ctx.helper.responeseJSON(ctx, {
        code: 4000,
        message: '当前丛书不存在绑定关系'
      });
      return;
    }
    const result = await service.subbook.delete({
      parent_id,
      book_id
    });
    if (result) {
      ctx.helper.responeseJSON(ctx, {
        data: {
          id: book_id
        }
      });
    } else {
      ctx.helper.responeseJSON(ctx, {
        code: 4000
      });
    }
  }

  async index() {
    const { ctx, config } = this;
    const { query, service } = ctx;
    const { id } = query;
    const data = await service.book.readBetter({ book_id: id });
    if (data) {
      data.coverPicture = ctx.helper.getBookCoverPicture(
        config.publicPath,
        data.book_id
      );
      const subbooks = await service.subbook.readAll({
        parent_id: id
      });
      const subCount = subbooks.length;
      if (subCount) {
        for (let i = 0; i < subCount; i++) {
          const subbook = subbooks[i];
          if (i == subCount - 1) {
            const lastbook = await service.book.readBetter({
              book_id: subbook.book_id
            });
            if (lastbook && lastbook.active_chapter_id) {
              data.activeChapter = lastbook.activeChapter;
              data.active_chapter_id = lastbook.active_chapter_id;
              data.updated_at = lastbook.updated_at;
            }
          }
          subbook.chapters = await service.chapter.readAll({
            book_id: subbook.book_id
          });
        }
        data.subbooks = subbooks;
      } else {
        const chapters = await service.chapter.readAll({ book_id: id });
        data.chapters = chapters;
      }
    }
    const res = {
      data
    };
    await ctx.render('book/detail.html', res);
  }
}

module.exports = BookController;
