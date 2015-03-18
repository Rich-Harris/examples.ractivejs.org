import express from 'express';
import serveStatic from 'serve-static';

import routes from './routes';
import * as CONFIG from '../config';

const app = express();

app.use( serveStatic( __dirname + '/public' ) );

app.get( '/', routes.root );
app.get( '/:id', routes.example );

app.listen( CONFIG.PORT, () => {
	console.log( `listening on ${CONFIG.PORT}` );
});