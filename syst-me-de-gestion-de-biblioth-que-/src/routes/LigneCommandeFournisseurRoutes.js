const express = require('express');
const router = express.Router();
const ligneCommandeController = require('../controllers/LigneCommandeFournisseurController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware(['bibliothecaire', 'administrateur']));

router.post('/', ligneCommandeController.createLigneCommande);

router.get('/commande/:idCommande', ligneCommandeController.getLignesByCommande);

router.put('/:id', ligneCommandeController.updateLigneCommande);

router.delete('/:id', ligneCommandeController.deleteLigneCommande);

router.get('/commande/:idCommande/total', ligneCommandeController.calculerTotalCommande);

module.exports = router;