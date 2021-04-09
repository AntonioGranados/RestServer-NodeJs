const { response } = require("express");
const { Categoria } = require("../models");

//Obtener Categorias - paginado - total de resultados - populate
const getCategorias = async(req, res = response) => {
    //Pasamos los querys opcionales como limite (numero de categorias a mostrar)
    const { limite = 5, desde = 0  } = req.query;

    //Hacemos un Promise.all para ejecutar dos promesas en simultaneo donde una sera el conteo total de 
    //registros y la segunda promesa mostrar todos las categorias
    const [totalDeRegistros, categorias] = await Promise.all([
        Categoria.countDocuments({estado: true}),
        Categoria.find({estado: true})
                 .skip(Number(desde)) //desde que registro mostrar
                 .limit(Number(limite)) //numero de registros a mostrar
                 .populate('usuario', 'nombre') //mostramos el nombre del schema usuario
    ]);

    res.json({
        totalDeRegistros,
        categorias
    });
}

//Obtener Categoria por id - populate
const getCategoriaPorId = async(req, res = response) => {
    //Obtenemos el id de la categoria con el req.params
    const { id } = req.params;

    //Buscamos la categoria con el id y mostramos el nomnre del usuario que creo la categoria
    const idCategoria = await Categoria.findById(id).populate('usuario', 'nombre');

    //Si la categoria ya ha sido eliminada, entonces no la mostramos
    if (idCategoria.estado === false) {
        return res.status(400).json({
            mensaje: `La categoría con el id ${id} no existe`
        });
    }

    res.json({
        idCategoria
    });
}

const crearCategoria = async(req, res = response) => {
    
    //Extraemos el nombre del body y lo convertirmos a mayusculas para guardarlo asi en la bd
    const nombre = req.body.nombre.toUpperCase();

    //Consultamos si ya existe una categoria con ese nombre en la bd
    const existeNombreDeCategoriaEnBd = await Categoria.findOne({nombre});

    //Si el nombre de la categoria existe, mostramos un error para no guardarla en la bd
    if(existeNombreDeCategoriaEnBd) {
        return res.status(400).json({
            mensaje: `La categoría con el nombre ${nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    //creamos la categoria con la data a guardar en la bd
    const categoria = new Categoria(data);

    //Guarda la categoria en la base de datos
    await categoria.save();

    res.status(201).json({
        categoria
    });
}

//Actualizar Categoria 
const putCategoria = async(req, res = response) => {

    //Extraemos el id de los params
    const {id} = req.params;

    //Extraemos el estado y el usuario que es informacion que no se va actualizar y guardamos el resto
    //de iformacion en la variable restoDeInformacion
    const {estado, usuario, ...restoDeInformacion} = req.body;

    //transformamos el nombre para guardarlo siempre en mayuscula
    restoDeInformacion.nombre = restoDeInformacion.nombre.toUpperCase();
    
    //id del usuario que esta actualizando la categoria
    restoDeInformacion.usuario = req.usuario._id;

    //Actualizamos la categoria con el id indicado, mandamos new: true para que nos muestre la info actualizada
    const categoriaDB = await Categoria.findByIdAndUpdate(id, restoDeInformacion, {new: true});

    res.json({
        categoriaDB
    });
}

//Eliminar Categoria - Estado false
const deleteCategoria = async(req, res = response) => {
    //extraemos el id de los params
    const {id} = req.params;

    //Eliminamos la referencia de la categoria
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        categoria
    });
}

module.exports = {
    getCategorias,
    getCategoriaPorId,
    crearCategoria,
    putCategoria,
    deleteCategoria
}