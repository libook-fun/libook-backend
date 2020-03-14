'use strict';

const Controller = require('egg').Controller;
class HomeController extends Controller {
  async index() {
    const { ctx, config } = this;
    // console.log(ctx.request.url)
    const { service } = ctx;
    const data = {};
    data.categorys = await service.category.readAll();
    // 首页banner展位
    data.bannerRecommenders = await service.recommender.readAll({
      state: 1,
      type: 10
    });
    data.bannerRecommenders.forEach(recommender => {
      recommender.picture = ctx.helper.getRecommenderPicture(
        config.publicPath,
        recommender.recommender_id
      );
    });
    // console.log(data.bannerRecommenders)
    // 首页编辑推荐展位
    data.editorRecommenders = await service.recommender.readAll({
      state: 1,
      type: 11
    });
    data.editorRecommenders.forEach(recommender => {
      recommender.picture = ctx.helper.getBookCoverPicture(
        config.publicPath,
        recommender.book_id
      );
    });
    // 首页自定义展位
    data.exhibitions = await service.exhibition.readAll(null, [
      ['updated_at', 'desc']
    ]);
    const exhibitionLength = data.exhibitions.length;
    for (let i = 0; i < exhibitionLength; i++) {
      const exhibition = data.exhibitions[i];
      exhibition.recommenders = await service.recommender.readAll({
        state: 1,
        type: 0,
        exhibition_id: exhibition.exhibition_id
      });
      exhibition.recommenders.forEach(recommender => {
        recommender.picture = ctx.helper.getBookCoverPicture(
          config.publicPath,
          recommender.book_id
        );
      });
    }
    // 首页普通推荐展位
    data.recommenders = await service.recommender.readAll({
      state: 1,
      type: 1
    });
    await ctx.render('home/index.html', {
      data
    });
  }
}

module.exports = HomeController;
