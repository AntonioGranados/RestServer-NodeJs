const { response } = require("express");
const { Producto } = require("../models");

const getProductos = async(req, res = response) => {
    //Pasamos los querys opcionales como limite (numero de productos a mostrar)
    const {limite = 5, desde = 0} = req.query;

    //Hacemos un Promise.all para ejecutar dos promesas en simultaneo donde una sera el conteo total de 
    //registros y la segunda promesa mostrar todos los productos
    const [totalDeRegistros, productos] = await Promise.all([
        Producto.countDocuments({estado: true}),
        Producto.find({estado: true})
                .skip(Number(desde)) //desde que registro mostrar
                .limit(Number(limite)) //numero de registros a mostrar
                .populate('categoria', 'nombre') //mostramos el nombre del schema categoria
                .populate('usuario', 'nombre') //mostramos el nombre del schema usuario    
    ]);

    res.json({
        totalDeRegistros,
        productos
    });
}

const getProductoPorId = async(req, res = response) => {
    //Obtenemos el id del producto con el req.params
    const { id } = req.params;

    //Buscamos el producto con el id y mostramos el nombre del usuario que creo la categoria
    const idProducto = await Producto.findById(id)
                                     .populate('categoria', 'nombre')
                                     .populate('usuario', 'nombre');


    //Si el producto ya ha sido eliminado, entonces no la mostramos
    if (idProducto.estado === false) {
        return res.status(400).json({
            mensaje: `El producto con el id ${id} no existe`
        });
    }

    res.json({
        idProducto
    });
}

const crearProducto = async(req, res = response) => {
    //Extraemos el estado y el usuario que es informacion que no va a digitar el usuario
    //y guardamos el restos de la informacion requerida del schema
    const { estado, usuario, ...restoDeInformacion } = req.body;
    
    //Extraemos el nombre para convertirlo en mayusculas
    const nombre = req.body.nombre.toUpperCase();

    //Buscamos el nombre del producto en el schema
    const existeNombreDeProductoEnBd = await Producto.findOne({nombre});

    //Si el nombre del producto ya existe
    if (existeNombreDeProductoEnBd) {
        return res.status(400).json({
            mensaje: `El nombre del producto ${nombre} ya existe, por favor ingrese un nuevo nombre`
        });
    }

    //Generamos la data con la informacion a guardar
    const data = {
        ...restoDeInformacion,
        nombre,
        usuario: req.usuario._id
    }
    //Creamos la instancia del producto a guardar
    const producto = new Producto(data);

    //Guradamos en la base de datos
    await producto.save();

    res.status(201).json({
        producto
    });

}

const putProducto = async(req, res = response) => {
    //Extraemos el id de los params
    const {id} = req.params;

    //Extraemos el estado y el usuario que es informacion que no se va actualizar y guardamos el resto
    //de iformacion en la variable restoDeInformacion
    const {estado, usuario, categoria, ...restoDeInformacion} = req.body;
    
    //transformamos el nombre para guardarlo siempre en mayuscula
    restoDeInformacion.nombre = restoDeInformacion.nombre.toUpperCase();
    
    //id del usuario que esta actualizando la categoria
    restoDeInformacion.usuario = req.usuario._id;
    
    //Actualizamos el producto con el id indicado, mandamos new: true para que nos muestre la info actualizada
    const productoDB = await Producto.findByIdAndUpdate(id, restoDeInformacion, {new: true});

    //Si el producto ya ha sido eliminado, no se podrá editar
    if (productoDB.estado === false) {
        return res.status(400).json({
            mensaje: `No puede modificar un producto que no existe`
        });
    }
    
    res.json({
        productoDB
    });
}

//Eliminar Producto - Estado false
const deleteProducto = async(req, res = response) => {
    //extraemos el id de los params
    const {id} = req.params;

    //Eliminamos la referencia del producto
    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

    //Si el producto ya ha sido eliminado, no se podrá volver a eliminar
    if (producto.estado === false) {
        return res.status(400).json({
            mensaje: `No puede eliminar un producto que no existe`
        });
    }

    res.json({
        producto
    });
}


module.exports = {
    getProductos,
    getProductoPorId,
    crearProducto,
    putProducto,
    deleteProducto
}