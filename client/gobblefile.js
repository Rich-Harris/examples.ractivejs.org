var gobble = require( 'gobble' );

gobble.cwd( __dirname );

var common = gobble( '../node_modules/ractive-www' );

var styles = gobble([
	common.grab( 'scss' ).moveTo( 'common' ),
	'src/scss'
]).transform( 'sass', { src: 'main.scss', dest: 'main.css' });

module.exports = gobble([
	'src/root',
	common,
	styles
]);