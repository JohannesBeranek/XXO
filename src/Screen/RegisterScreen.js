const Screen = require('./Screen');
const msgpack = require('msgpack-lite');

module.exports = class RegisterScreen extends Screen {
	constructor() {
		super('Register');


	}

	render(target) {
		super.render(target);

		if (!this.rootNode) {
			this.rootNode = document.createElement('div');
			this.rootNode.innerHTML = '\
	<form>\
	<label for="input-register-username">Username</label><input id="input-register-username">\
	<input type="submit" value="go">\
	</form>\
			';
			this.rootNode.querySelector('form').addEventListener('submit', e => this.onSubmit(e))
		}

		if (!this.rootNode.parentNode) {
			target.appendChild(this.rootNode);
		}
	}

	onSubmit(e) {
		e.preventDefault();

		console.log(e, this);
	}

	static pack(it) {
		return msgpack.encode(null);
	}

	static unpack(buffer) {
		return new RegisterScreen();
	}
}