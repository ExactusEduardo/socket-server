import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = ( cliente: Socket, io: socketIO.Server ) => {
    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );
    io.emit('usuarios-activos', usuariosConectados.getLista() );
}
export const desconectar = ( cliente: Socket, io: socketIO.Server ) => {
    
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuariosConectados.borrarUsuario( cliente.id );
    });
}
// Escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('mensaje', ( payload: { de: string, cuerpo: string } ) => {
        console.log('Mensaje recibido', payload);
        io.emit('mensaje-nuevo', payload );
    });
}
// Configurar usuario
export const configurarUsuario = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('configurar-usuario', ( payload: { nombre: string }, callback: Function ) => {
        // console.log('Configurando Usuario', payload);
        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );
        io.emit('usuarios-activos', usuariosConectados.getLista() );
        // io.emit('mensaje-nuevo', payload );
        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre }, configurado`
        })
    });
}
// Obtener Usuarios
export const obtenerUsuarios = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('obtener-usuarios', ()  => {
        console.log('Obtener Usuarios');
        io.to( cliente.id ).emit('usuarios-activos', usuariosConectados.getLista() );
    });

}