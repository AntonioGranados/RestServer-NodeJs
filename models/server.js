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

        //Objeto con las rutas
        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios'
        }

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
        //Usamos una nueva ruta para definir las autenticaciones de usuario
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        //Usamos el middleware de buscar donde se especificaran las peticiones
        this.app.use(this.paths.buscar, require('../routes/buscar.routes'));
        //Usamos el middleware de categorias donde se especificaran las peticiones para el crud   
        this.app.use(this.paths.categorias, require('../routes/categorias.routes'));
        //Usamos el middleware de productos donde se especificaran las peticiones para el crud
        this.app.use(this.paths.productos, require('../routes/productos.routes'));
        //usamos el middleware de usuarioPath donde esta especificada la ruta con las acciones (get, post..)
        this.app.use(this.paths.usuarios, require('../routes/usuarios.routes'));
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