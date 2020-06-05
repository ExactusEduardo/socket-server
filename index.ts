import Server from './classes/server';
import router from './routes/router'
import bodyParser from 'body-parser';
import cors from 'cors';

const server = new Server();

// BodyParser - lo que recibo en el request tomalo y conviertelo en un objeto javascript
server.app.use( bodyParser.urlencoded({ extended: true }) );
server.app.use( bodyParser.json() );

// CORS
server.app.use( cors( { origin: true, credentials: true } ) );

// Rutas del servicio
server.app.use('/', router);

server.start( () => {
    console.log(`Servidor corriendo el puerto ${ server.port }`);
});