/*Llamado, puerto y mensaje para confirmar por donde está corriendo en servidor. */

const app = require('./app');

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});