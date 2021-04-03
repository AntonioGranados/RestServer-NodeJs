//importamos jwt
const jwt = require('jsonwebtoken');

//Funcion para generar el jwt
const generarJwt = (uid) => {
    return new Promise((resolve, reject) => {
        //creamos el payload con la informacion que se va a guardar en el token, en este caso el uid
        const payload = { uid };

        //Generamos el token pasando el payload y nuestra secret key
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '1h' //expiracion del token
        }, (err, token) => {
            if (err) { //Si hay un error
                console.log(err);
                reject('No se pudo generar el token')
            } else { //Si todo sale bien 
                resolve(token);
            }
        });
    });
}


module.exports = {
    generarJwt
}