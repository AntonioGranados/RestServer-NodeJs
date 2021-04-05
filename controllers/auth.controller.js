const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJwt } = require('../helpers/generar-jwt');
const { verificarTokenGoogle } = require('../helpers/verificar-token-google');

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

const googleSignIn = async(req, res = response) => {
    //extraemos el id token del body
    const { id_token } = req.body;

    
    try {
        //desestructuramos y llamamos la funcion y enviamos el token
        const {correo, img, nombre} = await verificarTokenGoogle(id_token);

        //Generar referencia para ver si el correo ya existe en la base de datos
        let usuario = await Usuario.findOne({correo});

        //si el usuario no existe, lo creamos
        if (!usuario) {
            const data = {
                nombre,
                correo,
                //Como la contraseña nunca va ser igual al hash de bcrypt no importa lo que se almacene
                password: '>:(', 
                img,
                google: true
            };

            //hacemos una nueva instancia del usuario con la data que le estamos mandando
            usuario = new Usuario(data);

            //guardamos en la base de datos
            await usuario.save();
        }

        //Si el usuario en base de datos no existe o ha sido eliminado
        if (usuario.estado === false) {
            return res.status(401).json({
                mensaje: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //Generar el jwt
        const token = await generarJwt(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        res.status(400).json({
            mensaje: 'El token de Google no es válido'
        });   
    }
}

module.exports = {
    login,
    googleSignIn
}