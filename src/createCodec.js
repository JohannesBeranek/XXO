const msgpack = require('msgpack-lite');

module.exports = function createCodec() {
	const codec = msgpack.createCodec();

	// TODO: add custom classes

	return codec;
}