import { readdirSync, readFileSync } from 'sander';

const TEMPLATES_DIR = 'templates';
let templates = {};

readdirSync( TEMPLATES_DIR ).forEach( file => {
	let name = file.replace( /\.html$/, '' );
	templates[ name ] = readFileSync( TEMPLATES_DIR, file ).toString();
});

export default templates;