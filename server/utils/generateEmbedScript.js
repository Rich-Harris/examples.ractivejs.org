import * as marked from 'marked';
import rcu from 'rcu';
import Ractive from 'ractive';
import sortComponents from './sortComponents';
import generateComponent from './generateComponent';
import getFileList from './getFileList';

rcu.init( Ractive );

function clean ( code ) {
	return code.replace( /\t/g, '  ' ).trim();
}

export default function generateEmbedScript ( gist ) {
	const files = gist.files;
	const main = 'main.js' in files ?
		files[ 'main.js' ].content :
		`throw new Error( 'The ${gist.html_url} gist is missing a main.js file' );`

	let orderedFiles = getFileList( gist );

	const fileString = JSON.stringify( orderedFiles ).replace( /script>/g, 'scr" + "ipt>' );
	const gistString = JSON.stringify( gist ).replace( /script>/g, 'scr" + "ipt>' );

	let componentDefinitions = orderedFiles
		.filter( x => x.filename.slice( -5 ) === '.html' )
		.map( function ( component ) {
			return {
				name: component.filename.slice( 0, -5 ),
				parsed: rcu.parse( component.content )
			};
		});

	const externalModules = componentDefinitions.reduce( ( modules, component ) => {
		component.parsed.modules.forEach( mod => {
			if ( !~modules.indexOf( mod ) ) {
				modules.push( mod );
			}
		});

		return modules;
	}, [] );

	const externalModuleBlock = externalModules.map( mod => {
		const scriptBlock = `<script>window.currentModule = '${mod}';</script><script src='https://wzrd.in/standalone/${mod}@latest'></script>`
		return scriptBlock;
	}).join( '\n' );

	componentDefinitions = sortComponents( componentDefinitions );
	const componentStrings = componentDefinitions.map( generateComponent ).join( '\n' );

	const script = `
		<script>
			window.modules = {};

			window.define = function ( deps, factory ) {
				if ( deps.length ) {
					throw new Error( 'Cannot load secondary dependencies' );
				}

				window.modules[ window.currentModule ] = factory();
			};

			window.define.amd = true;

			window.require = function ( mod ) {
				return window.modules[ mod ];
			}
		</script>

		${externalModuleBlock}

		<script>
			(function () {
				var $ = function ( selector ) {
					return document.querySelector( selector );
				};

				var demo = $( '.demo' );

				var currentTab = null;
				var currentPane = null;

				function findElement( target, tagName ) {
					do {
						if ( target.tagName === tagName ) {
							return target;
						}

						target = target.parentNode;
					} while ( target );
				}

				function selectTab ( li ) {
					if ( currentTab ) {
						currentTab.className = '';
						currentPane.style.display = 'none';
					}

					currentTab = li;

					if ( li.getAttribute( 'data-type' ) === 'result' ) {
						currentPane = demo;
					} else {
						currentPane = $( '.file[data-file="' + li.getAttribute( 'data-file' ) + '"]' );
					}

					currentTab.className = 'active';
					currentPane.style.display = 'block';
				}

				$( 'nav' ).addEventListener( 'click', function ( event ) {
					var target = findElement( event.target, 'LI' );

					if ( !target ) {
						return;
					}

					if ( target === currentTab ) {
						return;
					}

					selectTab( target );
				});

				selectTab( $( '[data-type="result"]' ) );

				var files = ${fileString};
				var gist = ${gistString};

				// set width of nav based on contents
				$( 'nav' ).style.width = $( 'ul' ).offsetWidth + 'px';

				${componentStrings}

				${main}
			}());

		</script>`;

	return script;
}