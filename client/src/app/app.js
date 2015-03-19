import page from 'page';
import Ractive from 'ractive';

import getGist from './utils/getGist';
import { examples, slugToGistId, gistIdToSlug } from 'examples';

import Root from 'components/Root';
import Example from 'components/Example';

const Promise = Ractive.Promise;

let view;
let firstRun = true;
let exitPromise = Promise.resolve();

page( '/', () => {
	document.title = 'Examples | Ractive.js';

	exitPromise.then( () => {
		view = new Root({
			el: 'main',
			data: {
				examples
			},
			noIntro: firstRun
		});

		firstRun = false;
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

			view = new Example({
				el: 'main',
				data: { gist },
				noIntro: firstRun
			});

			firstRun = false;
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


