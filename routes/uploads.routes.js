const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controller');
const { coleccionesPermitidas } = require('../helpers');

const { validarCampos, validarArchivoASubir } = require('../middlewares');

const router = Router();

router.post('/', validarArchivoASubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoASubir,
    check('id', 'El id no es válido').isMongoId(),
    check('coleccion').custom(coleccion => coleccionesPermitidas(coleccion, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('coleccion').custom(coleccion => coleccionesPermitidas(coleccion, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)


module.exports = router;