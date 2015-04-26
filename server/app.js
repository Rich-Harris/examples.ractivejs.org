import express from 'express';
import gobble from 'connect-gobble';
import serveStatic from 'serve-static';

import View from 'components/View';
import EmbedView from 'components/EmbedView';

import { examples, gistIdToSlug, slugToGistId } from 'examples';
import getGist from './utils/getGist';
import getFileList from './utils/getFileList';
import generateEmbedScript from './utils/generateEmbedScript';
import * as CONFIG from '../config';

// create view
const view = new View({
	data: {
		examples
	},
	preserveWhitespace: true
});

// create embed view
const embedView = new EmbedView({
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

app.get( '/embed/:id', ( req, res ) => {
	let id = req.params.id;

	if ( id in gistIdToSlug ) {
		res.redirect( `/embed/${gistIdToSlug[id]}` );
		return;
	}

	if ( id in slugToGistId ) {
		id = slugToGistId[ id ];
	}

	getGist( id ).then( gist => {
		embedView.set({
			gist,
			files: getFileList( gist ),
			script: generateEmbedScript( gist )
		});

		res.send( embedView.toHTML() );
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

	getGist( id ).then( gist => {
		view.set({
			route: 'example',
			title: `Examples | Ractive.js`,
			gist: gist,
			payloadUrl: `/payload.js?gist_id=${id}`
		});

		res.send( view.toHTML() );
	}).catch( err => {
		res.status( err.statusCode ).end();
	});
});

app.listen( CONFIG.PORT, () => {
	console.log( `listening on ${CONFIG.PORT}` );
});
