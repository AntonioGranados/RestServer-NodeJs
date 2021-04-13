const { response } = require("express");
const {ObjectId} = require('mongoose').Types;

const {Usuario, Categoria, Producto} = require('../models');


//Creamos un arreglo con todas las colecciones de la base de datos permitidas para hacer busquedas
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

//función para buscar usuarios de la base de datos
const buscarUsuarios = async(terminoParaBuscar, res = response) => {
    //Si se quiere buscar por el id del usuario, validamos que sea un id de mongo valido
    const esMongoId = ObjectId.isValid(terminoParaBuscar);

    //Si el id de mongo a buscar es valido
    if (esMongoId) {
        //buscamos el usuario con el id a buscar
        const usuario = await Usuario.findById(terminoParaBuscar);
        return res.json({
            //Si lo encuentra mostramos el usuario, si no es id valido, mostramos un arreglo vacío
            resultados: (usuario) ? [usuario] : [] 
        });
    }

    //Creamos una expresion regular para hacer las busquedas case sesitive, es decir, que 
    //podamos buscar ya sea unsando mayusculas o minusculas
    const expresionRegular = new RegExp(terminoParaBuscar, 'i');

    //Si buscamos un usuario por su nombre o por su correo y debe tener su estado true
    const usuarios = await Usuario.find({
        $or: [{nombre: expresionRegular}, {correo: expresionRegular}],
        $and: [{estado: true}]
    });
    
    res.json({
        resultados: usuarios
    })
}

const buscarCategorias = async(terminoParaBuscar, res = response) => {
     //Si se quiere buscar por el id de la categoria, validamos que sea un id de mongo valido
     const esMongoId = ObjectId.isValid(terminoParaBuscar);

     //Si el id de mongo a buscar es valido
     if (esMongoId) {
         //buscamos la categoria con el id a buscar
         const categoria = await Categoria.findById(terminoParaBuscar);
         return res.json({
             //Si lo encuentra mostramos la categoria, si no es id valido, mostramos un arreglo vacío
             resultados: (categoria) ? [categoria] : [] 
         });
     }

     //Creamos una expresion regular para hacer las busquedas case sesitive, es decir, que 
     //podamos buscar ya sea unsando mayusculas o minusculas
     const expresionRegular = new RegExp(terminoParaBuscar, 'i');

     //Si buscamos una categoria por su nombre y debe tener su estado true
     const categorias = await Categoria.find({nombre: expresionRegular, estado: true});
    
     res.json({
        resultados: categorias
     });
}

const buscarProductos = async(terminoParaBuscar, res = response) => {
    //Si se quiere buscar por el id del producto, validamos que sea un id de mongo valido
    const esMongoId = ObjectId.isValid(terminoParaBuscar);

    //Si el id de mongo a buscar es valido
    if (esMongoId) {
        //buscamos el producto con el id a buscar
        const producto = await Producto.findById(terminoParaBuscar).populate('categoria', 'nombre');
        return res.json({
            //Si lo encuentra mostramos el producto, si no es id valido, mostramos un arreglo vacío
            resultados: (producto) ? [producto] : [] 
        });
    }

    //Creamos una expresion regular para hacer las busquedas case sesitive, es decir, que 
    //podamos buscar ya sea unsando mayusculas o minusculas
    const expresionRegular = new RegExp(terminoParaBuscar, 'i');

    //Si buscamos un producto por su nombre y debe tener su estado true
    const productos = await Producto.find({nombre: expresionRegular, estado: true})
                                    .populate('categoria', 'nombre');
    
     res.json({
        resultados: productos
     });
}

const buscar = async(req, res = response) => {

    //Extraemos de los params la coleccion y el termino por el que se quiere buscar
    const {coleccion, terminoDeBusqueda} = req.params;

    //Si en el arreglo de colecciones permitidas no se incluye la coleccion que se esta buscando
    //proveniente de los params
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            mensaje: `La colección que está intentando buscar no existe, por favor busque una colección valida: ${coleccionesPermitidas}`
        });
    }

    //Manejamos las colecciones con un switch
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(terminoDeBusqueda, res);    
            break;
        case 'categorias':
            buscarCategorias(terminoDeBusqueda, res);
            break;    
        case 'productos':
            buscarProductos(terminoDeBusqueda, res);
            break;   
        default:
            return res.status(500).json({
                mensaje: 'Se me olvidó hacer esta búsqueda'
            });
    }
}

module.exports = {
    buscar
}