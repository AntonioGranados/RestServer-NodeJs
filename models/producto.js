const { Schema, model } = require('mongoose');

//Creamos el Schema de Productos
const ProductoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
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
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    }
});

ProductoSchema.methods.toJSON = function() {
    //sacamos del Schema el version y el estado y almacenamos los demas campos en producto
    const { __v, estado, ...producto } = this.toObject();
    return producto;
}

//Exportamos el Schema Producto
module.exports = model('Producto', ProductoSchema);