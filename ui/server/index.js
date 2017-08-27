const Koa = require('koa');
const serve = require('koa-better-static');
const proxy = require('koa-proxy');
const path = require('path');
const logger = require('koa-logger');
const clc = require('cli-color');
const views = require('koa-views');
const cors = require('kcors');

const { renderReact } = require('../lib/server-rendering');

const info = clc.cyanBright.bold;
const link = clc.magentaBright.bold.underline;

const app = new Koa();
const buildDir = path.resolve(__dirname, '../build/public');

const node = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const port = process.env.PORT ? process.env.PORT : 3000;
const api = process.env.API_URL ? process.env.API_URL : 'http://localhost:8000';
const proxyServer = process.env.EXTERNAL_SERVER;

if (node === 'development') {
  app.use(logger());
}

if (proxyServer) {
  app.use(cors());
  app.use(proxy({
    host: api,
    match: new RegExp('^/api/'),
  }));
}

if (node === 'production') {
  app.use(views(`${__dirname}/views`, {
    map: {
      html: 'ejs',
    },
  }));

  app.use(serve(buildDir, { index: 'index.html'}));
  app.use(async (ctx) => {
    const appHtml = renderReact(ctx.url, {});
    await ctx.render('template', {
      react: appHtml,
    });
  });
} else {
  app.use(proxy({
    host: `http://localhost:${process.env.DEV_PORT}`,
    match: /\/|\/*.(js|css)$/,
  }));
}

console.info(info('API host ') + link(api));
console.info(info('Listening on port ') + link(`http://localhost:${port}`));

app.listen(port);
