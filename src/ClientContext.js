const EventEmitter = require('events').EventEmitter,
	MessageFilter = require('./MessageFilter'),
	msgpack = require('msgpack-lite');


module.exports = class ClientContext extends EventEmitter {
	constructor(app, websocket) {
		super();

		this.app = app;
		this.websocket = websocket;

		this.incomingMessageFilter = new MessageFilter(msgpack.decode, app.codec);
		this.incomingMessageFilter.output = (msg) => { this.msgHandler(msg); };

		this.outgoingMessageFilter = new MessageFilter(msgpack.encode, app.codec);
		this.outgoingMessageFilter.output = (msg) => { this.websocket.send(msg); };

		this.websocket.on('message', this.incomingMessageFilter.input);
	}

	msgHandler(msg) {
		const requestClass = msg.constructor.name;

		// TODO: security
		const ProcessorClass = require(`./ClientRequestProcessor/${requestClass}Processor.js`);

		const processor = new ProcessorClass(this);

		processor.process(msg);
	}

	send(msg) {
		this.outgoingMessageFilter.input(msg);
	}
};