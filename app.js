const express = require('express');
const cors = require('cors');

const app = express();

// middleware obligatorio
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// rutas
app.use('/api/usuarios', require('./routes/usuariosRoutes'));

app.get('/', (req, res) => {
  res.send('API funcionando');
});

module.exports = app;