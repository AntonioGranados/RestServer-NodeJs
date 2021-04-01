const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
    //atrapamos los errores que se presenten en la peticion
    const errors = validationResult(req);
    //si los errores no estan vacios mostramos el error
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    //Si no hay ningun error, es decir, paso la validacion, que pase al siguiente middleware
    next();
}


module.exports = {
    validarCampos
}

