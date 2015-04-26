import rcu from 'rcu';

export default function generateComponent ( x ) {
	let components = [];

	x.parsed.imports.forEach( x => {
		components.push( `${x.name}: ${rcu.getName(x.href)}` );
	});

	const block = `
		var ${x.name} = (function () {
			var options = {
				template: ${JSON.stringify(x.parsed.template)},
				css: ${JSON.stringify(x.parsed.css || '')},
				components: {${components.join(', ')}}
			};

			var component = {};

			${x.parsed.script || ''}

			if ( typeof component.exports === 'object' ) {
				for ( var key in component.exports ) {
					options[ key ] = component.exports[ key ];
				}
			}

			return Ractive.extend( options );
		}());`;

	return block;
}