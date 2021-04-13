const path = require('path');
const {v4: uuidv4} = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'gif', 'GIF', 'svg', 'SVG'] ,carpetaParaAlmacenarArchivo = '') => {

    return new Promise((resolve, reject) => {
        //Extraemos el archivo que viene en la request
        const { archivo } = files;

        //Cortamos el string del nombre del archivo con split y lo separamos por punto para crear el arreglo
        //con el nombre del archivo ya separada
        const nombreCortado = archivo.name.split('.');
        //obtenemos la ultima poisicion del arreglo que contiene la extension del archivo
        const extensionDelArchivo = nombreCortado[nombreCortado.length - 1]; 

        //Si la extension del archivo no contiene una extension valida del arreglo 
        if (!extensionesValidas.includes(extensionDelArchivo)) {
            return reject(`La extensión ${extensionDelArchivo} no es permitida, por favor suba una extensión válida (${extensionesValidas})`);
        }

        //Generamos un nombre temporal para el archivo, agregandole la extension del archivo
        const nombreTemporalDelArchivo = uuidv4() + '.' + extensionDelArchivo;

        //Contruimos el path donde queremos alamcenar el archivo que sera en la carpeta uploads, y si dentro
        //de esa carpeta queremos guardar archivos en otra carpeta se almacenara en el nombre de la carpeta
        //que especifiquemos, si no por defecto quedará en uploads
        const construirPath = path.join(__dirname, '../uploads/', carpetaParaAlmacenarArchivo, nombreTemporalDelArchivo);

        //Movemos el archivo al directorio creado
        archivo.mv(construirPath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(nombreTemporalDelArchivo);
        });
    });
}

module.exports = {
    subirArchivo
}