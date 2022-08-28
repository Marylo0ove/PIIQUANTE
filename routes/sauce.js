const express = require('express');
//Création d'un router avec la méthode router d'express
// La méthodeexpress.Router()  vous permet de créer des routeurs séparés pour chaque route principale de votre application – 
// vous y enregistrez ensuite les routes individuelles.
const router = express.Router();

const Sauce = require('../models/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Importation du controller
const sauceCtrl = require('../controllers/sauce');

router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/' + '', auth, sauceCtrl.getAllSauces);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;