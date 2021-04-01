//importamos mongoose
const mongoose = require('mongoose');


//Funcion para conectarse a la base de datos
const conexionABaseDeDatos = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Base de datos conectada');
    } catch (error) {
        console.log(error);
        throw new Error('Error al conectarse a la base de datos');
    }
}

module.exports = {
    conexionABaseDeDatos
}