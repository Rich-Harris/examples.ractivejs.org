import roadtrip from 'roadtrip';
import Ractive from 'ractive';

import getGist from './utils/getGist';
import { examples, slugToGistId, gistIdToSlug } from 'examples';

import Root from 'components/Root';
import Example from 'components/Example';
import Nav from 'components/Nav';

const Promise = Ractive.Promise;

let view;
let exitPromise = Promise.resolve();

new Nav({ el: '.nav-container' });

let lastRoute;

roadtrip
	.add( '/', {
		enter ( route ) {
			document.title = 'Examples | Ractive.js';

			route.view = new Root({
				el: 'main',
				data: {
					examples
				},
				noIntro: route.isInitial
			});
		},

		leave ( route ) {
			return route.view.teardown();
		}
	})

	.add( '/:id', {
		beforeenter ( route ) {
			let id = route.params.id;

			if ( id in gistIdToSlug ) {
				roadtrip.goto( `/${gistIdToSlug[id]}`, { replaceState: true });
				return;
			}

			if ( id in slugToGistId ) {
				id = slugToGistId[ id ];
			}

			route.gist = getGist( id )
		},

		enter ( route ) {
			return route.gist && route.gist.then( gist => {
				document.title = `${gist.description} | Examples | Ractive.js`;

				route.view = new Example({
					el: 'main',
					data: { gist },
					noIntro: route.isInitial
				});
			});
		},

		leave ( route ) {
			return route.view.teardown();
		}
	})

	.start();
