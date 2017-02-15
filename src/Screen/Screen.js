const msgpack = require('msgpack-lite');

module.exports = class Screen {
	constructor(title) {
		this.title = title;
	}

	render(target) {
		document.title = this.title;
	}

	static pack(it) {
		const data = it.title;
		return msgpack.encode(data);
	}

	static unpack(buffer) {
		const data = msgpack.decode(buffer);
		return new Screen(data);
	}
}