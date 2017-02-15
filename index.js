'use strict';
const createCompiled = require('./src/createCompiled'),
	Koa = require('koa'),
	route = require('koa-route'),
	conditional = require('koa-conditional-get'),
	etag = require('koa-etag'),
	websockify = require ('koa-websocket'),
	serve = require('koa-static'),
	compress = require('koa-compress'),
	zlib = require('zlib'),
	Application = require('./src/Application'),
	Game = require('./src/Game');

console.log('Creating compiled.js ...');
createCompiled();
console.log('Created compiled.js');

// create koa app
const kapp = websockify(new Koa());

const app = new Application();


// websocket route
kapp.ws.use(route.all('/', (ctx) => {
	app.connect(ctx.websocket);
}));

kapp.use(conditional());
kapp.use(etag());


// static stuff
kapp.use(compress({
	flush: zlib.Z_SYNC_FLUSH
}));

kapp.use(serve(__dirname + '/static'));


// listen
kapp.listen(80);
