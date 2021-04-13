const dbValidators = require('./dbValidators');
const generarJwt = require('./generar-jwt');
const subirArchivo = require('./subir-archivo');
const validarGoogle = require('./verificar-token-google');


module.exports = {
    ...dbValidators,
    ...generarJwt,
    ...subirArchivo,
    ...validarGoogle
}
