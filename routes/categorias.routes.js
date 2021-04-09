const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, getCategorias, getCategoriaPorId, putCategoria, deleteCategoria } = require('../controllers/categorias.controller');
const { existeCategoriaPorId } = require('../helpers/dbValidators');
const { validarJwt, siEsAdminRol } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

//Obtener todas las categorías - Público
router.get('/', getCategorias);

//Obtener una categoría por id
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], getCategoriaPorId);

//Crear categoría - Privado - cualquier persona con un token válido
router.post('/', [
    validarJwt,
    check('nombre', 'El nombre de la categoría es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar una categoría por id - Privado - cualquier persona con un token válido
router.put('/:id', [
    validarJwt,
    check('nombre', 'El nombre de la categoría es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], putCategoria);

//Eliminar una categoría - Solo Administradores
router.delete('/:id', [
    validarJwt,
    siEsAdminRol,
    check('id', 'No es un id válido').isMongoId(), //validamos que sea un id de mongo válido
    check('id').custom(existeCategoriaPorId),
    validarCampos
], deleteCategoria);

module.exports = router;
