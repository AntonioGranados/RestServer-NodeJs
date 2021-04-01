const { Schema, model } = require('mongoose');

//Creamos el Schema de rol
const RoleSchema = new Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});

//Exportamos el Schema rol
module.exports = model('Role', RoleSchema);