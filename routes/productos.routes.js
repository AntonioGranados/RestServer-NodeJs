const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, getProductos, getProductoPorId, putProducto, deleteProducto } = require('../controllers/productos.controller');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/dbValidators');

const { validarJwt, siEsAdminRol } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.get('/', getProductos);

//Obtener un producto por id
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], getProductoPorId);

router.post('/', [
    validarJwt,
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id válido de MongoDb').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

//Actualizar un producto por id - Privado - cualquier persona con un token válido
router.put('/:id', [
    validarJwt,
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], putProducto);

//Eliminar un producto - Solo Administradores
router.delete('/:id', [
    validarJwt,
    siEsAdminRol,
    check('id', 'No es un id válido').isMongoId(), //validamos que sea un id de mongo válido
    check('id').custom(existeProductoPorId),
    validarCampos
], deleteProducto);


module.exports = router;