const mongoose = require('mongoose'); // Importation de mongoose pour communiquer avec la base de données MongoDB

// On utilise la fonction schéma mise à dispo par le package mongoose auquel on va passer un objet
// qui va dicter les différents champs dont notre schéma a besoin
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default : 0 },
  dislikes: { type: Number, default : 0 },
  usersLiked: { type: Array},
  usersDisliked: { type: Array}
});

module.exports = mongoose.model('Sauce', sauceSchema); // Exportation du model

// Nom de la collection = pluriel du modèle = Sauces