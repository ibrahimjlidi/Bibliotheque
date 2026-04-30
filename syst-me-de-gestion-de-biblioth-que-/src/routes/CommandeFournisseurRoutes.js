const express = require('express');
const router = express.Router();
const commandeController = require('../controller/CommandefournisseurController');
const { auth, authorize } = require('../middelweras/authMiddleware');      



router.post('/createCommande', auth, authorize(['supplier']), commandeController.createCommande);

router.get('/getAllCommandes', auth, authorize(['admin']), commandeController.getAllCommandes);

router.get('/:id', auth, authorize(['admin', 'supplier']), commandeController.getCommandeById);

router.put('/:id', auth, authorize(['supplier']), commandeController.updateCommande);

router.delete('/:id', auth, authorize(['admin']), commandeController.deleteCommande);

module.exports = router;