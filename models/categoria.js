const { Schema, model } = require('mongoose');

//Creamos el Schema de Categoria
const CategoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId, //Otro objeto de mongo
        ref: 'Usuario', //hace referencia a la coleccion Usuario
        required: true
    },
});

CategoriaSchema.methods.toJSON = function() {
    //sacamos del Schema el version y el password y almacenamos los demas campos en usuario
    const { __v, estado, ...categoria } = this.toObject();
    return categoria;
}

//Exportamos el Schema Categoria
module.exports = model('Categoria', CategoriaSchema);