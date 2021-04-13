const { response } = require("express");
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
//Usamos la variable de entorno para usar cloudinary con nuestro usuario
cloudinary.config(process.env.CLOUDINARY_URL); 

const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require('../models');

const cargarArchivo = async(req, res = response) => {
 
    try {
        //Mostramos el archivo subido llamando la función y mandandole el archivo a subir,
        //undefined porque ya estan establecidas las extensiones válidas y que se guarden en una carpeta
        //llamada imgs
        const nombreArchivo = await subirArchivo(req.files, undefined, 'imgs' );
    
        res.json({
            nombreArchivo
        });  
    } catch (mensaje) {
        res.status(400).json({mensaje});
    }
}

const actualizarImagen = async(req, res = response) => {

    //Extraemos el id y la coleccion a la que le queremos actualizar la imgaen de los params
    const {coleccion, id } = req.params;

    //variable para poder cambiar el modelo
    let modelo;

    //manejamos las colecciones
    switch (coleccion) {
        case 'usuarios':
            //buscamos el id del usuario en el modelo usuario
            modelo = await Usuario.findById(id);

            //Si el id del usuario no existe en el modelo
            if (!modelo) {
                return res.status(400).json({
                    mensaje: `No existe un usuario con el id ${id}`
                });
            }            
            break;

        case 'productos':
            //buscamos el id del usuario en el modelo usuario
            modelo = await Producto.findById(id);
    
            //Si el id del usuario no existe en el modelo
            if (!modelo) {
                return res.status(400).json({
                        mensaje: `No existe un producto con el id ${id}`
                });
            }           
            break;    
    
        default:
            return res.status(500).json({
                mensaje: 'Se me olvidó validar esto'
            });
    }

    //limpiar imagenes previas para no acumular muchas imagenes en las carpetas
    //Si hay una imagen en el modelo 
    if (modelo.img) {
        //hay que borrar la imagen del servidor, seleccionamos la carpeta uploads, seleccionamos la
        //carpeta de la coleccion y el nombre de la imagen a borrar
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        
        //si existe la imagen en el modelo y en la coleccion
        if (fs.existsSync(pathImagen)) {
            //la eliminamos 
            fs.unlinkSync(pathImagen);
        }
    }

    //Subimos el archivo 
    const nombreArchivo = await subirArchivo(req.files, undefined, coleccion );

    //la imagen sera el nombre del archivo que estamos subiendo
    modelo.img = nombreArchivo;

    //Guardamos la imagen en la base de datos
    await modelo.save();

    res.json({
        modelo
    });
}

const actualizarImagenCloudinary = async(req, res = response) => {

    //Extraemos el id y la coleccion a la que le queremos actualizar la imgaen de los params
    const {coleccion, id } = req.params;

    //variable para poder cambiar el modelo
    let modelo;

    //manejamos las colecciones
    switch (coleccion) {
        case 'usuarios':
            //buscamos el id del usuario en el modelo usuario
            modelo = await Usuario.findById(id);

            //Si el id del usuario no existe en el modelo
            if (!modelo) {
                return res.status(400).json({
                    mensaje: `No existe un usuario con el id ${id}`
                });
            }            
            break;

        case 'productos':
            //buscamos el id del usuario en el modelo usuario
            modelo = await Producto.findById(id);
    
            //Si el id del usuario no existe en el modelo
            if (!modelo) {
                return res.status(400).json({
                        mensaje: `No existe un producto con el id ${id}`
                });
            }           
            break;    
    
        default:
            return res.status(500).json({
                mensaje: 'Se me olvidó validar esto'
            });
    }

    //limpiar imagenes previas para no acumular muchas imagenes en las carpetas
    //Si hay una imagen en el modelo
    if (modelo.img) {
        const nombreCortado = modelo.img.split('/');
        const nombreImagen = nombreCortado[nombreCortado.length - 1];
        const [public_id] = nombreImagen.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    //Extraemos el tempFilePath de la peticion del archivo
    const {tempFilePath} = req.files.archivo;


    //Extraemos el secure_url de la respuesta de cloudinary
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

    // //Subimos el archivo 
    // const nombreArchivo = await subirArchivo(req.files, undefined, coleccion );

    //la imagen sera el secure_url del archivo que estamos subiendo
    modelo.img = secure_url;

    //Guardamos la imagen en la base de datos
    await modelo.save();

    res.json({
        modelo
    });
}


const mostrarImagen = async(req, res = response) => {
    
      //Extraemos el id y la coleccion a la que le queremos actualizar la imgaen de los params
      const {coleccion, id } = req.params;

      //variable para poder cambiar el modelo
      let modelo;
  
      //manejamos las colecciones
      switch (coleccion) {
          case 'usuarios':
              //buscamos el id del usuario en el modelo usuario
              modelo = await Usuario.findById(id);
  
              //Si el id del usuario no existe en el modelo
              if (!modelo) {
                  return res.status(400).json({
                      mensaje: `No existe un usuario con el id ${id}`
                  });
              }            
              break;
  
          case 'productos':
              //buscamos el id del usuario en el modelo usuario
              modelo = await Producto.findById(id);
      
              //Si el id del usuario no existe en el modelo
              if (!modelo) {
                  return res.status(400).json({
                          mensaje: `No existe un producto con el id ${id}`
                  });
              }           
              break;    
      
          default:
              return res.status(500).json({
                  mensaje: 'Se me olvidó validar esto'
              });
      }
  
      //limpiar imagenes previas para no acumular muchas imagenes en las carpetas
      //Si hay una imagen en el modelo 
      if (modelo.img) {
          //seleccionamos la carpeta uploads, seleccionamos la
          //carpeta de la coleccion y el nombre de la imagen a borrar
          const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
          
          //si existe la imagen en el modelo y en la coleccion
          if (fs.existsSync(pathImagen)) {
              return res.sendFile(pathImagen);
          } 
      }

      //Si la imagen no se encuentra entonces mostramos una imgaen de relleno para indicar que no hay img
      const pathNoImagen = path.join(__dirname, '../assets/no-image.jpg');
      res.sendFile(pathNoImagen);
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}

