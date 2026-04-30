import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { Link } from "react-router-dom";

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyReservations();
  }, []);

  const fetchMyReservations = async () => {
    try {
      const res = await api.get("/reservations/mes-reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(res.data || []);
    } catch (err) {
      console.error("Failed to fetch your reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Annuler cette réservation ?")) return;
    try {
      await api.delete(`/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyReservations();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'annulation.");
    }
  };

  if (loading) return <div className="text-center mt-10">Chargement de vos réservations...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">📑 Mes Réservations</h1>
          <Link to="/livres" className="text-blue-600 hover:underline">⬅️ Retour aux livres</Link>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {reservations.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <p className="text-xl mb-4">Vous n'avez aucune réservation en cours.</p>
              <Link to="/livres" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Parcourir les livres
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-blue-900">Livre</th>
                    <th className="px-6 py-4 font-semibold text-blue-900">Date Réservation</th>
                    <th className="px-6 py-4 font-semibold text-blue-900">Statut</th>
                   
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservations.map((res) => (
                    <tr key={res._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">{res.livre?.titre}</div>
                        <div className="text-sm text-gray-500">{res.livre?.auteur}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(res.dateReservation).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          res.statutReservation === "confirmée" ? "bg-green-100 text-green-700" :
                          res.statutReservation === "annulée" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {res.statutReservation}
                        </span>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MesReservations;
