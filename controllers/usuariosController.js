const connection = require('../config/db');

/* =========================
   REGISTRAR USUARIO
========================= */
const registrarUsuario = (req, res) => {
    const {
        nombre_usuario,
        apellido,
        fecha_nacimiento,
        usuario,
        correo,
        contrasena,
        id_rol,
        id_perfil
    } = req.body;

    if (!nombre_usuario || !usuario || !correo || !contrasena) {
        return res.status(400).json({
            ok: false,
            mensaje: "Datos incompletos"
        });
    }

    const sql = `
        INSERT INTO usuario 
        (nombre_usuario, apellido, fecha_nacimiento, usuario, correo, contrasena, id_rol, id_perfil, fecha_registro)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    connection.query(
        sql,
        [
            nombre_usuario,
            apellido || null,
            fecha_nacimiento || null,
            usuario,
            correo,
            contrasena,
            id_rol || 1,
            id_perfil || 1
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: err.sqlMessage || "Error al registrar usuario"
                });
            }

            return res.status(201).json({
                ok: true,
                mensaje: "Usuario registrado correctamente",
                id: result.insertId
            });
        }
    );
};


/* =========================
   LOGIN USUARIO
========================= */
const loginUsuario = (req, res) => {
    const { usuario, nombre_usuario, contrasena } = req.body;

    console.log("BODY RECIBIDO:", req.body);

    // Compatibilidad: acepta ambos nombres, en lo que se arregla las columnas de la tabla usuario.
    const login = usuario || nombre_usuario;

    if (!login || !contrasena) {
        return res.status(400).json({
            ok: false,
            mensaje: "Usuario y contraseña son obligatorios"
        });
    }

    const sql = `
        SELECT id_usuario, nombre_usuario, usuario, correo, contrasena
        FROM usuario
        WHERE usuario = ?
        LIMIT 1
    `;

    connection.query(sql, [login], (err, results) => {
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

        const user = results[0];

        if (user.contrasena !== contrasena) {
            return res.status(401).json({
                ok: false,
                mensaje: "Contraseña incorrecta"
            });
        }

        return res.status(200).json({
            ok: true,
            mensaje: "Login exitoso",
            usuario: {
                id: user.id_usuario,
                nombre: user.nombre_usuario,
                usuario: user.usuario,
                correo: user.correo
            }
        });
    });
};

/* =========================
   OBTENER TODOS LOS USUARIOS
========================= */
const obtenerUsuarios = (req, res) => {
    const sql = `
        SELECT id_usuario, nombre_usuario, apellido, correo, usuario
        FROM usuario
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al obtener usuarios"
            });
        }

        return res.status(200).json({
            ok: true,
            datos: results
        });
    });
};


/* =========================
   OBTENER USUARIO POR ID
========================= */
const obtenerUsuarioPorId = (req, res) => { /*Revisado. Era el usuario mal escrito.*/
    const { id } = req.params;

    const sql = `
        SELECT id_usuario, nombre_usuario, apellido, correo, usuario 
        FROM usuario
        WHERE id_usuario = ?
    `;

    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            datos: results[0]
        });
    });
};


/* =========================
   BUSCAR USUARIO POR LOGIN
========================= */
const buscarUsuarioPorLogin = (req, res) => {

    const { usuario } = req.params;

    const sql = `
        SELECT
            id_usuario,
            nombre_usuario,
            apellido,
            usuario,
            correo
        FROM usuario
        WHERE usuario = ?
        LIMIT 1
    `;

    connection.query(sql, [usuario], (err, results) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            datos: results[0]
        });

    });

};


/* =========================
   ACTUALIZAR USUARIO
========================= */
const actualizarUsuario = (req, res) => {
    const { id } = req.params;
    const {
        nombre_usuario,
        apellido,
        correo
    } = req.body;

    const sql = `
        UPDATE usuario 
        SET nombre_usuario = ?, apellido = ?, correo = ?
        WHERE id_usuario = ?
    `;

    connection.query(
        sql,
        [nombre_usuario, apellido, correo, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al actualizar usuario"
                });
            }

            return res.status(200).json({
                ok: true,
                mensaje: "Usuario actualizado correctamente"
            });
        }
    );
};


/* =========================
   ELIMINAR USUARIO
========================= */
const eliminarUsuario = (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM usuario WHERE id_usuario = ?
    `;

    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al eliminar usuario"
            });
        }

        return res.status(200).json({
            ok: true,
            mensaje: "Usuario eliminado correctamente"
        });
    });
};


/* =========================
   EXPORTACIÓN CENTRALIZADA
========================= */
module.exports = {
    registrarUsuario, /* Agregar usuario*/
    loginUsuario,
    obtenerUsuarios, /*Listar */
    obtenerUsuarioPorId, /*Listar por ID */
    buscarUsuarioPorLogin, 
    actualizarUsuario, /*Update */
    eliminarUsuario /*Delete */
};

/*Nota: MUY IMPORTANTE. Verificar que cuando se mofiquen los valores de la 
tabla de usuarios, también se hagan en eel resto del cuerpo. 
Y también revisar que el fronted esté reicbiendo ESOS MISMOS campos 
porque eso fue lo que nos causó muchos errores y pore so se veía otra información que no era. 
Lo que pide el backend y el frontend debe coincidir siempre. */