const { response, request } = require('express');



const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJwt = async(req = request, res = response, next) => {
    //leemos el token que venga en el header
    const token = req.header('x-token');

    //Si el token no viene en los headers
    if (!token) {
        return res.status(401).json({
            mensaje: 'No existe el token en la petición'
        });
    }

    try {
        //Verificamos el jwt extrayendo el uid del usuario
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Obtenemos la informacion del usuario autenticado 
        const usuario = await Usuario.findById(uid);

        //si el usuario no existe en bd
        if (!usuario) {
            return res.status(401).json({
                mensaje: 'Token no válido'
            });
        }

        //verificar si el uid tiene estado false para que no pueda realizar acciones de eliminacion, edicion..
        if (usuario.estado === false) {
            return res.status(401).json({
                mensaje: 'Token no válido'
            });
        }

        //creamos una nueva propiedad en el objeto request igualada al uid del usuario
        req.usuario = usuario;
        
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            mensaje: 'Token no válido'
        });
    }
}


module.exports = {
    validarJwt
}