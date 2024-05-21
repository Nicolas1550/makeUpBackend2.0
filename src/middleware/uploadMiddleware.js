const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear la carpeta uploads si no existe
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Saving to:', uploadDir); // Verifica el directorio de destino
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    console.log('Filename:', filename); // Verifica el nombre del archivo
    cb(null, filename);
  }
});

const upload = multer({ storage });

module.exports = upload;


