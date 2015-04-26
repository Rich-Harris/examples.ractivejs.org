import marked from 'marked';

function clean ( code ) {
	return code.replace( /\t/g, '  ' ).trim();
}

const extPattern = /(\.\w+)$/;

const languageScore = {
	Markdown: 1,
	JavaScript: 2,
	HTML: 3
};

export default function getFileList ( gist ) {
	let list = Object.keys( gist.files )
		.map( filename => {
			const file = gist.files[ filename ];

			return {
				filename,
				language: file.language,
				content: file.language === 'Markdown' ? marked( file.content ) : clean( file.content )
			};
		}).sort( ( a, b ) => {
			return ( ( languageScore[ a.language ] || 4 ) - ( languageScore[ b.language ] || 4 ) ) ||

				// Everything else alphabetically
				( a.filename < b.filename ? -1 : 1 );
		});

	return list;
}