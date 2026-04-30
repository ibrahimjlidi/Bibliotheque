const express = require('express');
const router = express.Router();

const reservationController = require('../controller/ReservationController');
const { auth, authorize } = require('../middelweras/authMiddleware');

// =======================
// 📚 Routes Étudiant
// =======================

// ➜ Ajouter une réservation
router.post(
  '/ajouter',
  auth,
  authorize(['etudiant']),
  reservationController.createReservation
);

// ➜ Voir mes réservations
router.get(
  '/mes-reservations',
  auth,
  authorize(['etudiant']),
  reservationController.getMyReservations
);

// =======================
// 👨‍💼 Routes Employé
// =======================

// ➜ Voir toutes les réservations
router.get(
  '/',
  auth,
  authorize(['employe']),
  reservationController.getAllReservations
);

// ➜ Confirmer une réservation
router.put(
  '/confirmer/:id',
  auth,
  authorize(['employe']),
  reservationController.confirmerReservation
);

// ➜ Annuler une réservation
router.delete(
  '/:id',
  auth,
  authorize(['employe']),
  reservationController.annulerReservation
);

module.exports = router;