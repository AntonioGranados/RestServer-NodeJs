const express = require('express');
const cors = require('cors');
const { conexionABaseDeDatos } = require('../database/config.db');

//creamos la clase server
class Server {
    //definimos las propiedades que tendra la clase Server en el constructor
    constructor() {
        //creamos la app de express como propiedad de la clase Server
        this.app = express();

        //definimos el puerto como propiedad de la clase Server
        this.puerto = process.env.PORT;

        //ruta de usuarios
        this.usuarioPath = '/api/usuarios';

        //Conectar a la base de datos
        this.conectarBaseDeDatos();

        //Middlewares
        this.middlewares();

        //llamamos el metodo routes | Rutas de mi aplicación
        this.routes();
    }

    //llamar la conexion a la base de datos
    async conectarBaseDeDatos() {
        await conexionABaseDeDatos();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Lectura y parseo del Body
        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static('public'));
    }

    //Método routes para definir las rutas
    routes() {
        //usamos el middleware de usuarioPath donde esta especificada la ruta con las acciones (get, post..)
        this.app.use(this.usuarioPath, require('../routes/usuarios.routes'));   
    }

    //Metodo para lanzar el servidor definiendo el puerto
    listen() {
        this.app.listen(this.puerto, () => {
            console.log(`Servidor escuchando en el puerto ${this.puerto}`);
        });
    }
}

//Exportamos el server para usarlo por fuera
module.exports = Server;