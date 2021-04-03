const { response } = require("express")


const siEsAdminRol = (req, res = response, next) => {

    //validamos antes de que en el usuario venga el token para poder validar el rol
    if (!req.usuario) {
        return res.status(500).json({
            mensaje: 'Se quiere verificar el rol sin validar el token primero'
        })
    }

    //Extraemos el rol y nombre del usuario que viene en la request
    const { rol, nombre } = req.usuario;
    
    //Si el rol no es administrador
    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            mensaje: `El usuario ${nombre} no es un Administrador`
        });
    }
    next();
}

//recibimos los roles que vienen de la peticion usando es operador spread 
const tieneRol = (...roles) => {
    //retornamos la funcion que se va a ejecutar en la peticion
    return (req, res = response, next) => {
        
        //validamos antes de que en el usuario venga el token para poder validar el rol
        if (!req.usuario) {
            return res.status(500).json({
                mensaje: 'Se quiere verificar el rol sin validar el token primero'
            });
        }

        //Si el rol no esta incluido dentro de los roles validos
        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                mensaje: `El servicio requiere uno de estos roles ${roles}`
            });
        }

        next();
    }
}


module.exports = {
    siEsAdminRol,
    tieneRol
}