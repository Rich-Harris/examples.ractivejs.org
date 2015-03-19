import Ractive from 'ractive';

import { examples, slugToGistId, gistIdToSlug } from 'examples';
import templates from 'templates';
import getGist from 'utils/getGist';

let Page = Ractive.extend({
	template: templates.main,
	partials: {
		nav: templates.nav,
		footer: templates.footer
	}
});

export default function example ( req, res, next ) {
	let id = req.params.id;

	if ( id in gistIdToSlug ) {
		res.redirect( `/${gistIdToSlug[id]}` );
		return;
	}

	if ( id in slugToGistId ) {
		id = slugToGistId[ id ];
	}

	// getGist( id ).then( gist => {
	// 	let gists = {};
	// 	gists[ id ] = gist;

		let page = new Page({
			data: {
				title: `Examples | Ractive.js`,
				payloadUrl: `/payload.js?gist_id=${id}`,
				// payload: {
				// 	examples,
				// 	gists
				// }
			}
		});

		res.send( page.toHTML() );
	// }).catch( err => {
	// 	next( err );
	// });
}
