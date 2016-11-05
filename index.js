'use strict';
const fs = require('fs'),
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


// create js for client
let clientCode = '';

const clientFilesReady = [
	'node_modules/msgpack-lite/dist/msgpack.min.js',
];

for (const clientFile of clientFilesReady) {
	clientCode += fs.readFileSync(clientFile, 'utf-8');
}

const clientFiles = [
	'src/ClientRequest/GetScreenRequest.js',
	'src/ClientRequest/PlayerRegisterRequest.js',
	'src/MessageFilter.js',
];


for (const clientFile of clientFiles) {
	clientCode += fs.readFileSync(clientFile, 'utf-8').replace('module.exports = ', '');
}

fs.writeFileSync('static/compiled.js', clientCode);


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
