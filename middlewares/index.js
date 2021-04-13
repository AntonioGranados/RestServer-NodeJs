
const validarCampos = require('../middlewares/validar-campos');
const validarJwt = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validarArchivoASubir = require('../middlewares/validar-archivo');


module.exports = {
    ...validarCampos,
    ...validarJwt,
    ...validaRoles,
    ...validarArchivoASubir
}