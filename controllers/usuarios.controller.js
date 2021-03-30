const { response } = require("express");


const getUsuarios = (req,res = response) => {
    //querys opcionales en la url
    const query = req.query;
    res.json({
        mensaje: 'Get Api - Controlador',
        query
    });
}

const postUsuarios = (req,res = response) => {
    //leemos la informacion enviada por el usuario
    const body = req.body;

    res.json({
        mensaje: 'Post Api - Controlador',
        body
    });
}

const putUsuarios = (req,res = response) => {
    //leemos los parametros enviadas desde la ruta
    const id = req.params.id;
    res.json({
        mensaje: 'Put Api - Controlador',
        id
    });
}

const deleteUsuarios = (req,res = response) => {
    res.json({
        mensaje: 'Delete Api - Controlador'
    });
}

module.exports = {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    deleteUsuarios
}