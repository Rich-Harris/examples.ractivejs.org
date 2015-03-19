import page from 'page';
import Ractive from 'ractive';

import getGist from './utils/getGist';
import { examples, slugToGistId, gistIdToSlug } from 'examples';

import Root from './views/Root';
import GistViewer from './views/GistViewer';

const Promise = Ractive.Promise;

let view, exitPromise = Promise.resolve();

page( '/', () => {
	document.title = 'Examples | Ractive.js';

	exitPromise.then( () => {
		view = new Root({
			el: 'main',
			data: {
				examples
			}
		});
	});
});

page( '/:id', route => {
	exitPromise.then( () => {
		let id = route.params.id;

		if ( id in gistIdToSlug ) {
			page( `/${gistIdToSlug[id]}` );
			return;
		}

		if ( id in slugToGistId ) {
			id = slugToGistId[ id ];
		}

		getGist( id ).then( gist => {
			document.title = `${gist.description} | Examples | Ractive.js`;

			console.log( 'gist', gist );

			view = new GistViewer({
				el: 'main',
				data: { gist }
			});
		})

		.catch( err => {
			setTimeout( () => {
				throw err;
			});
		});
	});
});

page.exit( ( route, next ) => {
	if ( view ) {
		exitPromise = view.teardown();
		view = null;
	} else {
		exitPromise = Promise.resolve();
	}

	next();
});

page.start();


