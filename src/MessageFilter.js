module.exports = class MessageFilter {
	constructor(transformFunction, codec = null) {
		this.codec = codec;
		this.output = null;
		this.transformFunction = transformFunction;

		// needed workaround as long as we can't use arrow functions as class methods
		// without this, this.input can't be used as an event listener
		this.inputFn = this.input;
		this.input = (msg) => { this.inputFn(msg); };
	}

	input(msg) {
		const transformed = this.transformFunction(msg, { codec: this.codec });
		this.outputFunction(transformed);
	}

	set output(fn) {
		this.outputFunction = fn || this.noop;
	}

	noop() {}
}