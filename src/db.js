const mongoose = require('mongoose');

async function dbConnect() {
    // Conexión a la base de datos
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conexión a MongoDB establecida");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error.message);
        throw error;
    }
}

module.exports = dbConnect;


