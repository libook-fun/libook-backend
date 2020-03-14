# libook-backend

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7010/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### Docker Deploy

## Deploy by Dockerfile
```bash
$ docker build -t libook-backend .
$ docker run --name container-libook-backend -p 7001:7001 libook-backend
```

## Deploy by docker-compose
```bash
$ docker-compose up --build -d
```

### mysql
```bash
$ docker exec -it libook-backend /bin/bash
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org
[nunjucks]: http://mozilla.github.io/nunjucks/