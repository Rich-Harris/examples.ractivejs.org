import express from 'express';
import serveStatic from 'serve-static';
import gobble from 'connect-gobble';

import routes from './routes';
import * as CONFIG from '../config';

const app = express();

app.use( gobble( 'client/gobblefile.js' ) );

app.get( '/', routes.root );
app.get( '/payload.js', routes.payload );
app.get( '/:id', routes.example );

app.listen( CONFIG.PORT, () => {
	console.log( `listening on ${CONFIG.PORT}` );
});
