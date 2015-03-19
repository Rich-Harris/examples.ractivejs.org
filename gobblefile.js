var gobble = require( 'gobble' );
var client = require( './client/gobblefile' );

gobble.cwd( __dirname );

var shared = gobble( 'shared' ).transform( 'ractive', { type: 'es6' });

var server = gobble([ 'server', shared, 'config.js' ])
	.transform( 'babel', {
		whitelist: [
			'es6.arrowFunctions',
			'es6.blockScoping',
			'es6.classes',
			'es6.constants',
			'es6.destructuring',
			'es6.parameters.default',
			'es6.parameters.rest',
			'es6.properties.shorthand',
			'es6.templateLiterals'
		]
	})
	.transform( 'esperanto-bundle', {
		type: 'cjs',
		'entry': 'app',
		strict: true,
		sourceMap: false
	});

module.exports = gobble([ client.moveTo( 'public' ), server ]);
//module.exports = server;
