var gobble = require( 'gobble' );

gobble.cwd( __dirname );

var common = gobble( '../node_modules/ractive-www' );

var styles = gobble([
	common.grab( 'scss' ).moveTo( 'common' ),
	'src/scss'
]).transform( 'sass', { src: 'main.scss', dest: 'main.css' });

var app = gobble([ 'src/app', '../shared' ])
	.transform( 'ractive', {
		type: 'es6'
	})
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
		entry: 'app',
		strict: true
	})
	.transform( 'browserify', {
		entries: [ './app' ],
		dest: 'app.js',
		standalone: 'App',
		debug: true
	});

module.exports = gobble([
	'src/root',
	common,
	styles,
	app
]);
