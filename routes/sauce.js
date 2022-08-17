const express = require('express');
const Sauce = require('../models/sauce');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

router.post('/', sauceCtrl.createThing);
router.get('/:id', sauceCtrl.getOneSauce);
router.put('/:id', sauceCtrl.modifySauce);
router.delete('/:id', sauceCtrl.deleteSauce);
router.get('/' + '', sauceCtrl.getAllSauces);

module.exports = router;