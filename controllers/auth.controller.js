const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJwt } = require('../helpers/generar-jwt');

const login = async(req, res = response) => {

    //extraemos el correo y contraseña del body
    const {correo, password} = req.body;

    try {
        //verificar si el correo existe
        const usuario = await Usuario.findOne({correo});
        //si el usuario no existe
        if (!usuario) {
            return res.status(400).json({
                mensaje: 'El usuario / password son incorrectos'
            });
        }

        //si el usuario esta activo en bd (estado: true)
        if (usuario.estado === false) { //si el usuario no esta activo (estado: false)
            return res.status(400).json({
                mensaje: 'El usuario / password son incorrectos'
            });
        }

        //verificar la contraseña
        const validarPassword = bcryptjs.compareSync(password, usuario.password); //comparamos el password
        if (validarPassword === false) { //Si la contraseña no coinciden
            return res.status(400).json({
                mensaje: 'El Usuario / Password son incorrectos'
            });
        }

        //Generar el jwt
        const token = await generarJwt(usuario.id); //guardamos en el payload del token el id del usuario

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: 'Hubo un error, comuniquese con el administrador'
        });
    }
}

module.exports = {
    login
}