const { Router } = require('express');
const { check } = require('express-validator');

const { rolValido, emailExistente, existeUsuarioPorId } = require('../helpers/dbValidators');

const { getUsuarios, 
        postUsuarios,
        putUsuarios,
        deleteUsuarios } = require('../controllers/usuarios.controller');

const {validarCampos, validarJwt, siEsAdminRol, tieneRol} = require('../middlewares');

//usamos el router de express        
const router = Router();

//ruta para obtener usuarios
router.get('/', getUsuarios);

//ruta para crear usuarios
//Usamos check para validar el campo correo y mostrar el mensaje de error, para validar si es un email valido
router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6}),
        check('correo', 'El correo no es válido').isEmail(),
        check('correo').custom(emailExistente),
        check('rol').custom(rolValido),
        // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        validarCampos
], postUsuarios);

//ruta para actualizar usuarios
router.put('/:id', [
        check('id', 'No es un id válido').isMongoId(), //validamos que sea un id de mongo válido
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(rolValido),
        validarCampos
],putUsuarios);

//ruta para eliminar usuarios
router.delete('/:id', [
        validarJwt,
        // siEsAdminRol,
        tieneRol('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'),
        check('id', 'No es un id válido').isMongoId(), //validamos que sea un id de mongo válido
        check('id').custom(existeUsuarioPorId),
        validarCampos
] , deleteUsuarios);


module.exports = router;