'use strict';
const Koa = require('koa'),
	route = require('koa-route'),
	websockify = require ('koa-websocket'),
	serve = require('koa-static'),
	compress = require('koa-compress'),
	zlib = require('zlib'),
	Application = require('./src/Application'),
	Game = require('./src/Game');

const kapp = websockify(new Koa());

const app = new Application();

// websocket route
kapp.ws.use(route.all('/', (ctx) => {
	app.connect(ctx.websocket);
}));


// static stuff
kapp.use(compress({
	flush: zlib.Z_SYNC_FLUSH
}));
kapp.use(serve(__dirname + '/static'));

kapp.listen(80);
