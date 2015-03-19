import express from 'express';
import gobble from 'connect-gobble';
import serveStatic from 'serve-static';

import View from 'components/View';

import { examples, gistIdToSlug, slugToGistId } from 'examples';
import getGist from './utils/getGist';
import * as CONFIG from '../config';

// create view
const view = new View({
	data: {
		examples
	},
	preserveWhitespace: true
});

const app = express();

//app.use( gobble( 'client/gobblefile.js' ) );
app.use( serveStatic( __dirname + '/public' ) );

app.get( '/', ( req, res ) => {
	view.set( 'route', 'root' );
	res.send( view.toHTML() );
});

app.get( '/payload.js', ( req, res ) => {
	let id = req.query.gist_id;

	getGist( id ).then( gist => {
		let gists = {};
		gists[ id ] = gist;

		let payload = { examples, gists };

		res.type( 'text/javascript' );
		res.send( `var INITIAL_DATA = ${JSON.stringify(payload)};` );
	}).catch( err => {
		res.status( err.statusCode ).end();
	});
});

app.get( '/:id', ( req, res ) => {
	let id = req.params.id;

	if ( id in gistIdToSlug ) {
		res.redirect( `/${gistIdToSlug[id]}` );
		return;
	}

	if ( id in slugToGistId ) {
		id = slugToGistId[ id ];
	}

	view.set({
		title: `Examples | Ractive.js`,
		payloadUrl: `/payload.js?gist_id=${id}`
	});

	res.send( view.toHTML() );
});

app.listen( CONFIG.PORT, () => {
	console.log( `listening on ${CONFIG.PORT}` );
});
