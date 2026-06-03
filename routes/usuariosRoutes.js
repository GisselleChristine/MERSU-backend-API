const express = require('express');
const router = express.Router();

const {
    registrarUsuario,
    loginUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuariosController');

// autenticación
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);

// CRUD
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;