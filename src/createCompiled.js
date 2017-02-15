const fs = require('fs'),
	esprima = require('esprima'),
	escodegen = require('escodegen'),
	esmangle = require('esmangle2');

module.exports = function createCompiled() {
	// create js for client
	const astAll = {
		type: 'Program',
		body: []
	};

	const isProduction = process.env.NODE_ENV === 'production';

	const esprimaConf = isProduction
		? () => ({})
		: f => ({ loc: true, source: f });

	const clientFiles = [
		'node_modules/msgpack-lite/dist/msgpack.min.js',
		'src/ClientRequest/GetScreenRequest.js',
		'src/ClientRequest/PlayerRegisterRequest.js',
		'src/Screen/Screen.js',
		'src/Screen/RegisterScreen.js',
		'src/MessageFilter.js',
		'src/getCodec.js',
		'src/Browser/index.js',
	];

	for (const clientFile of clientFiles) {
		let fileContent = fs.readFileSync(clientFile, 'utf-8');

		if (!clientFile.match(/(\/Browser\/|\.min\.js$)/)) {
			// make sure to keep location information correct by replacing stuff with spaces with the same string length
			fileContent = fileContent.replace(/([\s\S]*module.exports\s*=\s*)/, m => ' '.repeat(m.length));
		}

		const astNew = esprima.parse(
			fileContent,
			esprimaConf(clientFile)
		);

		astAll.body = astAll.body.concat(astNew.body);
	}

	// create optimized ast
	// ast = esmangle.optimize(ast);


	// mangle optimized ast
	// ast = esmangle.mangle(ast);

	// create code with escodegen
	const compiled = escodegen.generate(
		astAll,
		{
			format: {
				indent: {
					style: '',
					base: 0
				},
				newline: '',
				space: ' ',
				compact: true,
			},
			sourceMap: !isProduction,
			sourceMapWithCode: true
		}
	);

	if (isProduction) {
		fs.writeFileSync('static/compiled.js', compiled);
	} else {
		const compiledCode = `${compiled.code}\n//# sourceMappingURL=/compiled.js.map`;

		fs.writeFileSync('static/compiled.js', compiledCode);
		fs.writeFileSync('static/compiled.js.map', compiled.map.toString());
	}

}
