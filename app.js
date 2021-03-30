require('dotenv').config();

const Server = require('./models/server');

//creamos una nueva instancia del servidor
const server = new Server();

//llamamos el metodo listen
server.listen();

