const msgpack = require('msgpack-lite');

module.exports = class MessageFilter {
	constructor(codec = null) {
		this.codec = codec;
		this.output = null;

		// needed workaround as long as we can't use arrow functions as class methods
		// without this, this.input can't be used as an event listener
		this.inputFn = this.input;
		this.input = (msg) => { this.inputFn(msg); };
	}

	input(msg) {
		const decoded = msgpack.decode(msg, { codec: this.codec });
		this.outputFunction(decoded);
	}

	set output(fn) {
		this.outputFunction = fn || this.noop;
	}

	noop() {}
}