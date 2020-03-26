'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  // app.io.of('/')
  // console.log(app.io)
  app.io.route('chat', app.io.controller.chat.index);

  // app.io.of('/chat')
  app.io.of('/chat').route('chat', app.io.controller.chat.index);
};