import Ractive from 'ractive';

import { IDS } from 'config';
import templates from 'templates';
import getGist from 'utils/getGist';

let reverseLookup = {};
Object.keys( IDS ).forEach( alias => {
	reverseLookup[ IDS[ alias ] ] = alias;
});

let Example = Ractive.extend({
	template: templates.example,
	partials: {
		nav: templates.nav
	}
});

export default function example ( req, res ) {
	let id = req.params.id;

	if ( id in reverseLookup ) {
		res.redirect( `/${reverseLookup[id]}` );
		return;
	}

	if ( id in IDS ) {
		id = IDS[ id ];
	}

	getGist( id ).then( gist => {
		let example = new Example({
			data: gist
		});

		res.send( example.toHTML() );
	});
}