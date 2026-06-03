const express = require('express');
const app = express();

require('./config/db');

app.use(express.json());

// RUTAS
app.use('/api/usuarios', require('./routes/usuariosRoutes'));

module.exports = app;

app.get('/', (req, res) => {
    res.send('API funcionando');
});