'use strict';

module.exports = (options, app) => {
  return async function user(ctx, next) {
    const user = ctx.cookies.get('user', {
      signed: false
    });
    const passport = ctx.cookies.get('passport', {
      signed: false
    });
    if (
      user &&
      user.includes(`shuyang`) &&
      passport &&
      passport.includes(`2016${user}0524`)
    ) {
      await next();
    } else {
      ctx.status = 403;
      ctx.body = '您已被管理员屏蔽了。有疑问请联系站长。';
      return;
    }
  };
};
