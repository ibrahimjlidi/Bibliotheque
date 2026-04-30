const express = require('express');
const router = express.Router();
const amendeController = require('../controller/AmendeController');
const { auth, authorize } = require('../middelweras/authMiddleware');

router.get('/', amendeController.getAllAmendes);
router.get('/:id', amendeController.getAmendeById);

router.post('/', auth, authorize(['employe', 'admin']), amendeController.createAmende);
router.put('/:id', auth, authorize(['employe', 'admin']), amendeController.updateAmende);
router.delete('/:id', auth, authorize(['employe', 'admin']), amendeController.deleteAmende);

module.exports = router;