const express = require('express');
const router = express.Router();
const categorieController = require('../controller/CategorieController');
const { auth, authorize } = require('../middelweras/authMiddleware');

// Routes publiques (lecture seule)
router.get('/', categorieController.getAllCategories);
router.get('/:id', categorieController.getCategorieById);

// Routes protégées (création, mise à jour, suppression)
router.post('/', auth, authorize(['employe', 'admin']), categorieController.createCategorie);
router.put('/:id', auth, authorize(['employe', 'admin']), categorieController.updateCategorie);
router.delete('/:id', auth, authorize(['employe', 'admin']), categorieController.deleteCategorie);

module.exports = router;
