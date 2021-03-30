const { Router } = require('express');
const { getUsuarios, 
        postUsuarios,
        putUsuarios,
        deleteUsuarios } = require('../controllers/usuarios.controller');

//usamos el router de express        
const router = Router();

//ruta para obtener usuarios
router.get('/', getUsuarios);

//ruta para crear usuarios
router.post('/', postUsuarios);

//ruta para actualizar usuarios
router.put('/:id', putUsuarios);

//ruta para eliminar usuarios
router.delete('/', deleteUsuarios);


module.exports = router;