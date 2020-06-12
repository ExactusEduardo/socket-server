import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';

import http from 'http';

import * as socket from '../sockets/socket';

export default class Server {

    private static _instance: Server;

    // servidor: express levanta un servidor http
    public app: express.Application;
    public port: number;

    // propiedad encargada de emitir eventos en los sockets.
    public io: socketIO.Server;

    // utilizampos httpServer porque este será el que permitirá la conexión entre express y socket
    // por lo cual cuando levante el servidor lo que hará es levantar el httpServer y no el app
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server( this.app );

        this.io = socketIO( this.httpServer );
        this.escucharSockets();
    }
    public static get instance() {
        return this._instance || ( this._instance = new this() );
    }
    private escucharSockets() {
        console.log('Escuchando conexiones - sockets');
        this.io.on('connection', cliente => {
            console.log('Cliente conectado');

            // Conectar cliente
            socket.conectarCliente( cliente, this.io );

            // Configurar usuario
            socket.configurarUsuario( cliente, this.io );

            // Obtener Usuarios
            socket.obtenerUsuarios( cliente, this.io );
            
            // Mensajes
            socket.mensaje( cliente, this.io );

            //Desconectar
            socket.desconectar( cliente, this.io );

        });

    }
    start( callback: any ) {
        this.httpServer.listen( this.port, callback );
    }
}