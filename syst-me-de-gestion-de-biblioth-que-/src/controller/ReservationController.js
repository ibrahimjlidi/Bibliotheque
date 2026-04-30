const Reservation = require('../models/Reservation');
const Livre = require("../models/Livre");
const Exemplaire = require("../models/Exemplaire");

// ✅ Ajouter réservation
async function createReservation(req, res) {
  try {
    const { livre } = req.body;

    // Vérifier livre existe
    const livreTrouve = await Livre.findById(livre);
    if (!livreTrouve) {
      return res.status(404).json({ message: "Livre introuvable" });
    }

    // Vérifier disponibilité du livre
    if (livreTrouve.statutLivre === "indisponible") {
      return res.status(400).json({ message: "Livre déjà indisponible" });
    }

    // Trouver un exemplaire disponible pour ce livre
    const exemplaireDisponible = await Exemplaire.findOne({ 
      livreId: livre, 
      disponible: true 
    });

    if (!exemplaireDisponible) {
       // Si aucun exemplaire n'est dispo, on marque le livre comme indisponible par sécurité
       livreTrouve.statutLivre = "indisponible";
       await livreTrouve.save();
       return res.status(400).json({ message: "Aucun exemplaire disponible pour ce livre" });
    }

    // Créer réservation
    const reservation = new Reservation({
      livre: livre,
      exemplaire: exemplaireDisponible._id,
      utilisateur: req.user.id // Injecté par le middleware auth
    });

    await reservation.save();

    // Marquer l'exemplaire comme indisponible
    exemplaireDisponible.disponible = false;
    await exemplaireDisponible.save();

    // Vérifier s'il reste d'autres exemplaires disponibles pour ce livre
    const autresExemplaires = await Exemplaire.find({ livreId: livre, disponible: true });
    if (autresExemplaires.length === 0) {
      livreTrouve.statutLivre = "indisponible";
      await livreTrouve.save();
    }

    res.status(201).json(reservation);

  } catch (error) {
    console.error("Erreur création réservation:", error);
    res.status(400).json({ message: error.message });
  }
}

// ✅ Étudiant: mes réservations
async function getMyReservations(req, res) {
  try {
    const reservations = await Reservation.find({ utilisateur: req.user.id })
      .populate('livre');

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ✅ Employé: toutes les réservations
async function getAllReservations(req, res) {
  try {
    const reservations = await Reservation.find()
      .populate('utilisateur', 'nom prenom')
      .populate('livre');

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ✅ Confirmer réservation
async function confirmerReservation(req, res) {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

reservation.statutReservation = "confirmée";    await reservation.save();

    res.json(reservation);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ✅ Annuler réservation
async function annulerReservation(req, res) {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // (optionnel) remettre livre disponible
    const livre = await Livre.findById(reservation.livre);
    if (livre) {
      livre.statutLivre = "disponible";
      await livre.save();
    }

    res.json({ message: "Réservation annulée" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ✅ Export
module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  confirmerReservation,
  annulerReservation
};