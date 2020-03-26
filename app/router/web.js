'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;

  const simpleBlock = middleware.simpleBlock();
  // router.post('/upload', controller.upload.upload);
  // router.post('/upload2', controller.upload.upload2);

  const categoryRouter = router.namespace('/api/v1/category');
  categoryRouter.post('/create', simpleBlock, controller.category.create);
  categoryRouter.post('/update', simpleBlock, controller.category.update);
  categoryRouter.get('/read', controller.category.read);
  categoryRouter.get('/read-all', controller.category.readAll);

  const bookRouter = router.namespace('/api/v1/book');
  bookRouter.post('/create', simpleBlock, controller.book.create);
  bookRouter.post('/update', simpleBlock, controller.book.update);
  bookRouter.get('/read', controller.book.read);
  bookRouter.get('/read-all', controller.book.readAll);
  bookRouter.get('/subbooks', controller.book.subbooks);
  bookRouter.get('/available-subbooks', controller.book.availableSubbooks);
  bookRouter.get('/parentbook', controller.book.parentbook);
  bookRouter.post('/bind', simpleBlock, controller.book.bind);
  bookRouter.post('/unbind', simpleBlock, controller.book.unbind);

  const chapterRouter = router.namespace('/api/v1/chapter');
  chapterRouter.post('/create', simpleBlock, controller.chapter.create);
  chapterRouter.get('/grab', simpleBlock, controller.chapter.grab);
  chapterRouter.post('/update', simpleBlock, controller.chapter.update);
  chapterRouter.get('/read', controller.chapter.read);
  chapterRouter.get('/read-all', controller.chapter.readAll);

  const exhibitionRouter = router.namespace('/api/v1/exhibition');
  exhibitionRouter.post('/create', simpleBlock, controller.exhibition.create);
  exhibitionRouter.post('/update', simpleBlock, controller.exhibition.update);
  exhibitionRouter.get('/read', controller.exhibition.read);
  exhibitionRouter.get('/read-all', controller.exhibition.readAll);
  exhibitionRouter.post('/delete', simpleBlock, controller.exhibition.delete);

  const recommenderRouter = router.namespace('/api/v1/recommender');
  recommenderRouter.post('/create', simpleBlock, controller.recommender.create);
  recommenderRouter.post('/update', simpleBlock, controller.recommender.update);
  recommenderRouter.post('/active', simpleBlock, controller.recommender.active);
  recommenderRouter.post(
    '/disable',
    simpleBlock,
    controller.recommender.disable
  );
  recommenderRouter.get('/read', controller.recommender.read);
  recommenderRouter.get('/read-all', controller.recommender.readAll);
  recommenderRouter.post('/delete', simpleBlock, controller.recommender.delete);

  const passportController = router.namespace('/api/v1/passport');
  passportController.post('/login', controller.passport.login);
  passportController.post('/register', controller.passport.register);

  // const weixinRouter = router.namespace('/api/v1/wx');
  // weixinRouter.get('/login', controller.weixin.login);

  router.get('/category', controller.category.index);
  router.get('/exhibition', controller.exhibition.index);
  router.get('/book', controller.book.index);
  router.get('/chapter', controller.chapter.index);
  router.get('/help', controller.help.index);
  router.get('/', controller.home.index);

  // app.passport.mount('github');

  router.get('/cms', simpleBlock, controller.cms.index);
  router.get('/cms/*', simpleBlock, controller.cms.index);
};
