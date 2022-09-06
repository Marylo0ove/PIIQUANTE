const express = require('express'); // Importation d'express
//Création d'un router avec la méthode router d'express
// La méthode express.Router() permet de créer des routeurs séparés pour chaque route principale l'application
// et d'y enregistrez ensuite les routes individuelles.
const router = express.Router();

const Sauce = require('../models/sauce'); // Importation du model de sauce
const auth = require('../middleware/auth'); // Importation du middleware d'authentification
const multer = require('../middleware/multer-config'); // Importation de multer pour la gestion des images
const sauceCtrl = require('../controllers/sauce');// Importation du controler

router.post('/', auth, multer, sauceCtrl.createSauce); // Création d'une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); // Affichage d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Modification sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Suppression d'une sauce
router.get('/' + '', auth, sauceCtrl.getAllSauces); // Affichage de toutes les sauces
router.post('/:id/like', auth, sauceCtrl.likeSauce); // Like / Dislike

module.exports = router; // Exportation du router