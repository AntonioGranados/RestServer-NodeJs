const Role = require('../models/role');
const Usuario = require('../models/usuario');


const rolValido = async(rol = '') => { //custom para validacion personalizada
    //buscamos si el rol se encuenta en la coleccion roles
    const existeRol = await Role.findOne({rol});
    //Si el rol no existe en la base de datos
    if(!existeRol) {
        //Mostramos un mensaje personalizado con throw error
        throw new Error(`El rol ${rol} no está registrado en la base de datos`);
    }
}

//Verificar si el correo existe
const emailExistente = async(correo = '') => {
    const existeEmail =  await Usuario.findOne({correo});

    if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe, por favor ingrese un correo diferente`);
    }
}

//Verificar si el usuario con ID existe
const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);

    //Si el usuario con el ID no existe, mandamos un error
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
} 


module.exports = {
    rolValido,
    emailExistente,
    existeUsuarioPorId
}