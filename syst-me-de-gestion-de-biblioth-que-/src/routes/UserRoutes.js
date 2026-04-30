const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');
const { auth, authorize } = require('../middelweras/authMiddleware');
const upload = require('../middelweras/upload');

// Public routes
router.post('/register', upload.single('imageProfil'), userController.register);
router.post('/login', userController.login);

// Protected routes (admin seulement)
router.post('/', auth, authorize('admin'), userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', auth, authorize('admin'), userController.getUserById);
//router.put('/:id', auth, authorize('admin'), userController.updateUser);
router.put('/:id', upload.single('imageProfil'), userController.updateUser);
router.delete('/:id', auth, authorize('admin'), userController.deleteUser);

// Protected route pour l’utilisateur connecté
router.put('/me', auth, userController.updateMe);

module.exports = router;
