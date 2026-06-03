const connection = require('../config/db');

// Validación de contraseña
const validarPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[+\-_$.])[A-Za-z\d+\-_$.]{8,}$/;
    return regex.test(password);
};

// REGISTRO
const registrarUsuario = (req, res) => {
    const { nombre_usuario, correo, contrasena, id_rol, id_perfil } = req.body;

    if (!nombre_usuario || !correo || !contrasena) {
        return res.status(400).json({ mensaje: "Datos incompletos" });
    }

    if (!validarPassword(contrasena)) {
        return res.status(400).json({
            mensaje: "Contraseña inválida"
        });
    }

    const sql = `
        INSERT INTO usuario (nombre_usuario, correo, contrasena, id_rol, id_perfil, fecha_registro)
        VALUES (?, ?, ?, ?, ?, NOW())
    `;

    connection.query(sql,
        [nombre_usuario, correo, contrasena, id_rol, id_perfil],
        (err, result) => {
            if (err) {
                return res.status(500).json({ mensaje: "Error en servidor" });
            }

            return res.status(201).json({
                mensaje: "Usuario registrado correctamente",
                id: result.insertId
            });
        }
    );
};

// LOGIN
const loginUsuario = (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({
            ok: false,
            mensaje: "Correo y contraseña son obligatorios"
        });
    }

    const sql = `
        SELECT id_usuario, nombre_usuario, correo, contrasena
        FROM usuario
        WHERE correo = ?
    `;

    connection.query(sql, [correo], (err, results) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error en servidor"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: "Usuario no encontrado"
            });
        }

        const usuario = results[0];

        if (usuario.contrasena !== contrasena) {
            return res.status(401).json({
                ok: false,
                mensaje: "Contraseña incorrecta"
            });
        }

        return res.status(200).json({
            ok: true,
            mensaje: "Login exitoso",
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre_usuario,
                correo: usuario.correo
            }
        });
    });
};

module.exports = {
    registrarUsuario,
    loginUsuario
};


//PARA GET todos-toditos
const obtenerUsuarios = (req, res) => {
    const sql = "SELECT id_usuario, nombre_usuario, correo FROM usuario";

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error en servidor" });
        }

        return res.status(200).json({
            ok: true,
            usuarios: results
        });
    });
};



//PARA GET por ID

const obtenerUsuarioPorId = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT id_usuario, nombre_usuario, correo FROM usuario WHERE id_usuario = ?";

    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error en servidor" });
        }

        if (results.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            usuario: results[0]
        });
    });
};


//PARA PUT-Actualizar

const actualizarUsuario = (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, correo } = req.body;

    const sql = `
        UPDATE usuario 
        SET nombre_usuario = ?, correo = ?
        WHERE id_usuario = ?
    `;

    connection.query(sql,
        [nombre_usuario, correo, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ mensaje: "Error en servidor" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    ok: false,
                    mensaje: "Usuario no encontrado"
                });
            }

            return res.status(200).json({
                ok: true,
                mensaje: "Usuario actualizado correctamente"
            });
        }
    );
};



//PARA DELETE - nota: tener atención con este

const eliminarUsuario = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM usuario WHERE id_usuario = ?";

    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error en servidor" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            mensaje: "Usuario eliminado correctamente"
        });
    });
};



//Ya para exportarlos todos finalmente

module.exports = {
    registrarUsuario,
    loginUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
};