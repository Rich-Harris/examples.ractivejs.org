import { examples } from 'examples';
import getGist from '../../utils/getGist';

export default function payload ( req, res ) {
	console.log( 'in payload route' );

	let id = req.query.gist_id;

	getGist( id ).then( gist => {
		let gists = {};
		gists[ id ] = gist;

		let payload = { examples, gists };

		console.log( 'payload', payload );

		res.type( 'text/javascript' );
		res.send( `var INITIAL_DATA = ${JSON.stringify(payload)};` );
	}).catch( err => {
		res.status( err.statusCode ).end();
	});
}
