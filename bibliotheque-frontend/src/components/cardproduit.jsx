import { Link } from "react-router-dom";
import { useState } from "react";
import { api } from "../api/axios";

const BACKEND_URL = "http://localhost:3001";

function CardProduit({ livre }) {
  const [loading, setLoading] = useState(false);
  const [statut, setStatut] = useState(livre.statutLivre);

  const handleReservation = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté pour réserver un livre.");
        return;
      }

      await api.post("/reservations/ajouter", {
        livre: livre._id,
      });

      setStatut("indisponible");
      alert("Réservation effectuée avec succès ✅");

    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors de la réservation (Vérifiez que vous êtes connecté en tant qu'étudiant)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition">
      {livre.image ? (
        <img
          src={livre.image?.startsWith("http") ? livre.image : `${BACKEND_URL}${livre.image}`}
          alt={livre.titre}
          className="w-full h-64 object-cover"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
          Pas d'image
        </div>
      )}

      <div className="p-4">
        <h2 className="text-lg font-bold text-blue-800">{livre.titre}</h2>
        <p className="text-gray-600">Auteur: {livre.auteur}</p>
        <p className="text-gray-500 text-sm">Langue: {livre.langue}</p>

        {/* 🔵 Bouton Réserver */}
        {statut === "disponible" ? (
          <button
            onClick={handleReservation}
            disabled={loading}
            className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Réservation..." : "Réserver"}
          </button>
        ) : (
          <button
            disabled
            className="mt-3 w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
          >
            Indisponible
          </button>
        )}

        <Link
          to={`/livres/${livre._id}`}
          className="mt-2 inline-block text-blue-600 hover:underline"
        >
          Voir détails
        </Link>
      </div>
    </div>
  );
}

export default CardProduit;