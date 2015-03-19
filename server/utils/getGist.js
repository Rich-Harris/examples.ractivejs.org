import * as LRU from 'lru-cache';
import { Promise } from 'es6-promise';
import request from 'request-promise';

let cache = LRU({
	max: 100 * 1024,
	length ( gist ) {
		return JSON.stringify( gist ).length;
	}
});

export default function getGist ( id ) {
	if ( cache.has( id ) ) {
		return Promise.resolve( cache.get( id ) );
	}

	let promise = request({
		url: `https://api.github.com/gists/${id}`,
		headers: {
			'User-Agent': 'ractivejs'
		}
	}).then( JSON.parse );

	promise.then( gist => {
		cache.set( id, gist );
	});

	return promise;
}
