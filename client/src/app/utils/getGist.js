import Ractive from 'ractive';

const Promise = Ractive.Promise;

let cache = ( typeof INITIAL_DATA !== 'undefined' && INITIAL_DATA.gists ) || {};
let uid = 1;

export default function getGist ( id ) {
	if ( id in cache ) {
		return Promise.resolve( cache[ id ] );
	}

	let promise = new Promise( ( fulfil, reject ) => {
		var script = document.createElement( 'script' );
		var callback = '__JSONPCALLBACK__' + uid++;

		window[ callback ] = gist => {
			cleanup();
			fulfil( gist.data );
		};

		script.onerror = err => {
			cleanup();
			reject( err );
		};

		script.src = `https://api.github.com/gists/${id}?callback=${callback}`;
		document.body.appendChild( script );

		function cleanup () {
			script.parentNode.removeChild( script );
			delete window[ callback ];
		}
	});

	promise.then( gist => cache[ id ] = gist );
	return promise;
}
