const { response } = require("express");

const validarArchivoASubir = (req, res = response, next) => {

        //Si en la request no viene el archivo ó el nombre archivo
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
            return res.status(400).json({
                mensaje: 'No ha seleccionado ningún archivo'
            });
        }

        next();
}

module.exports = {
    validarArchivoASubir
}