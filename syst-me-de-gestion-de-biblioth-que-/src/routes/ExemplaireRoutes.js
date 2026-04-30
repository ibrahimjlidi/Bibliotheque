const express = require('express');
const router = express.Router();
const exemplaireController = require('../controller/Exemplaire');
const { auth, authorize } = require('../middelweras/authMiddleware');

router.get('/', exemplaireController.getAllExemplaires);
router.get('/:id', exemplaireController.getExemplaireById);

router.post('/', auth, authorize(['employe', 'admin']), exemplaireController.createExemplaire);
router.put('/:id', auth, authorize(['employe', 'admin']), exemplaireController.updateExemplaire);
router.delete('/:id', auth, authorize(['employe', 'admin']), exemplaireController.deleteExemplaire);

module.exports = router;