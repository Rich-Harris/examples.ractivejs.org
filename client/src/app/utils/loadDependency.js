import Ractive from 'ractive';

let lastDependencyLoaded;

window.define = function ( deps, factory ) {
	if ( deps.length ) {
		throw new Error( 'Cannot load secondary dependencies' );
	}

	lastDependencyLoaded = factory();
};

window.define.amd = true;

export default function loadDependency ( name ) {
	return new Ractive.Promise( ( fulfil, reject ) => {
		let script = document.createElement( 'script' );

		script.onload = () => {
			script.parentNode.removeChild( script );
			fulfil( lastDependencyLoaded );
		};

		script.onerror = reject;

		script.src = `https://wzrd.in/standalone/${name}@latest`;

		document.body.appendChild( script );
	});
}