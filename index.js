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

const app = new Application(__dirname);


function shutdown(e) {
	app.shutdown().then(() => {
		console.log('App shut down successfully.');
		process.exit(0);
	}, (err) => {
		console.error('Error shutting down:', err);
		process.exit(1);
	});
}


process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

const appPromise = app.initAsync();

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

appPromise.then(() => {
	console.log('App ready.')

	// listen
	kapp.listen(80);
});

