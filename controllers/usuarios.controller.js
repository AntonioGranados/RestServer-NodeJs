const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const getUsuarios = async(req,res = response) => {
    //Pasamos los querys opcionales como limite (numero de usuarios a mostrar)
    const { limite = 5, desde = 0 } = req.query;

    
    //Hacemos un Promise.all para ejecutar dos promesas en simultaneo donde una sera el conteo total de 
    //registros y la segunda promesa mostrar todos los usuarios
    const [totalDeRegistros, usuarios] = await Promise.all([
        Usuario.countDocuments({estado: true}), 
        Usuario.find({estado: true})
               .skip(Number(desde)) //desde que registro mostrar
               .limit(Number(limite)) //numero de registros a mostrar
    ]);

    res.json({
        totalDeRegistros,
        usuarios
    });
}

const postUsuarios = async(req,res = response) => {

    //leemos la informacion enviada por el usuario
    const {nombre, correo, password, rol} = req.body;
    //creamos una nueva instancia de usuario y le enviamos la informacion que venga en el body
    const usuario = new Usuario({nombre, correo, password, rol});

    //Encriptar la contraseña
    //Generamos el numero de saltos para encriptar la contraseña, por defecto viene en 10
    const salt = bcryptjs.genSaltSync();

    //Encriptamos la contraseña con el hash enviandole la contraseña que viene en el body y el numero de saltos
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardamos el registro en la bd
    await usuario.save();

    res.json({
        usuario
    });
}

const putUsuarios = async(req,res = response) => {
    //leemos los parametros enviadas desde la ruta
    const {id} = req.params;
    //exluimos el password y si se creo con google y obtenemos el resto de informacion del body
    const { _id, password, google, correo, ...restoDeInformacionDelBody } = req.body;

    //Si la contraseña existe es porque el usuario quiere actualizar la contraseña y volvemos hacer el hash
    if (password) {
        //Encriptar la contraseña
        //Generamos el numero de saltos para encriptar la contraseña, por defecto viene en 10
        const salt = bcryptjs.genSaltSync();
        //Encriptamos la contraseña con el hash enviandole la contraseña que viene en el body y el numero de saltos
        restoDeInformacionDelBody.password = bcryptjs.hashSync(password, salt);
    }

    //Actualizamos el registro mandando el id del usuario a actualizar y el resto de la info(nombre, etc..)
    const usuarioDB = await Usuario.findByIdAndUpdate(id, restoDeInformacionDelBody);

    res.json({
        usuarioDB
    });
}

const deleteUsuarios = async(req,res = response) => {
    //Obtenemos el id de los params
    const {id} = req.params;

    //Eliminar un usuario fisicamente de la base de datos
    // const usuario = await Usuario.findByIdAndDelete(id);

    //Eliminar la referencia del usuario
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json({
        usuario
    });
}

module.exports = {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    deleteUsuarios
}