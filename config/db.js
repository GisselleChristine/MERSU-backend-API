/*PARA LA CONEXIÓN CON LA BASE DE DATOS(MySQL): proyecto_mersu */

const mysql = require('mysql2');
require('dotenv').config();

// Conexión a MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Conectar base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conexión exitosa a MySQL');
});

module.exports = connection;

/*Establecemos la conexión con la BD mediante una constante 'connection'
donde establecemos la conexión con msql y definimos datos como
host, usser, password, db name, port. Datos que están en el .env */

/*Actualización: Tuvimos un error porque los servicos de msql no estaban iniciados.
Una vez se corrigió, se estableció la conexión con la BD. */

