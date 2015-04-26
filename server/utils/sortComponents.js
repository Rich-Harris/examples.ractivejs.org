import rcu from 'rcu';

export default function sortComponents ( components ) {
	let sorted = [];
	let byName = {};
	let visited = {};

	components.forEach( x => byName[ x.name ] = x );

	function visit ( x ) {
		if ( visited[ x.name ] ) return;
		visited[ x.name ] = true;

		x.parsed.imports.forEach( y => {
			const name = y.href.replace( /\.html$/, '' );
			visit( byName[ name ] );
		});

		sorted.push( x );
	};

	components.forEach( visit );

	return sorted;
};