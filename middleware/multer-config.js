const multer = require('multer'); // Importation de multer

const MIME_TYPES = { // Dictionnaire des extensions
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ // Création de l'objet de configuration
  destination: (req, file, callback) => { // Où on enregistre le fichier
    callback(null, 'images'); // Dans le dossier image
  },
  filename: (req, file, callback) => { // Quel nom de fichier générer
    const name = file.originalname.split(' ').join('_'); // On remplace les espaces du nom d'origine par des _
    const extension = MIME_TYPES[file.mimetype]; // Création de l'extension à partir du mime type envoyé depuis le front-end
    callback(null, name + Date.now() + '.' + extension); // Création du nom du fichier avec timestamp et extension
  }
});

module.exports = multer({storage: storage}).single('image'); // Exportation du middleware, fichier image unique et uniquement