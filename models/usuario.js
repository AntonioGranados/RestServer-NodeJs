const { Schema, model } = require('mongoose');

//Creamos el schema de usuarios, entiendase Schema como una tabla de mi base de datos
const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});


UsuarioSchema.methods.toJSON = function() {
    //sacamos del Schema el version y el password y almacenamos los demas campos en usuario
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id; // cambiamos visualmente _id por uid
    return usuario;
}

//Exportamos el modelo de usuario especificando el nombre del modelo y el nombre del Schema
module.exports = model('Usuario', UsuarioSchema);