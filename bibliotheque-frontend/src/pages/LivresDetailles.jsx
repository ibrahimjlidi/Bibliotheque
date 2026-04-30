// src/pages/LivresDetailles.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/axios";

const BACKEND_URL = "http://localhost:3001"; // Port du serveur Node (3001)

function LivresDetailles() {
  const { id } = useParams();
  const [livre, setLivre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [statut, setStatut] = useState(null);

  useEffect(() => {
    api.get(`/livres/${id}`)
      .then(res => {
        setLivre(res.data);
        setStatut(res.data.statutLivre);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement du livre:", err);
        setLoading(false);
      });
  }, [id]);

  const handleReservation = async () => {
    try {
      setReserving(true);
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
      alert(error.response?.data?.message || "Erreur lors de la réservation");
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <div className="text-center text-gray-600 mt-10">Chargement...</div>;
  if (!livre) return <div className="text-center text-red-500 mt-10">Livre introuvable</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">{livre.titre}</h1>
        
        {livre.image ? (
          <img
            src={livre.image?.startsWith("http") ? livre.image : `${BACKEND_URL}${livre.image}`}
            alt={livre.titre}
            className="w-full h-80 object-cover rounded-lg mb-6"
          />
        ) : (
          <div className="w-full h-80 bg-gray-200 flex items-center justify-center text-gray-500 mb-6">
            Pas d'image
          </div>
        )}

        <p className="text-gray-700 mb-2"><strong>Auteur :</strong> {livre.auteur}</p>
        {livre.editeur && <p className="text-gray-700 mb-2"><strong>Éditeur :</strong> {livre.editeur}</p>}
        {livre.anneePublication && <p className="text-gray-700 mb-2"><strong>Année :</strong> {new Date(livre.anneePublication).getFullYear()}</p>}
        <p className="text-gray-700 mb-2"><strong>Langue :</strong> {livre.langue}</p>
        <p className="text-gray-700 mb-4"><strong>Description :</strong> {livre.description}</p>

        <div className="mt-6 flex justify-between">
          <Link
            to="/livres"
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            ⬅️ Retour
          </Link>
          {statut === "disponible" ? (
            <button 
              onClick={handleReservation}
              disabled={reserving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {reserving ? "Réservation..." : "📚 Réserver"}
            </button>
          ) : (
            <button 
              disabled
              className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
            >
              Indisponible
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LivresDetailles;
