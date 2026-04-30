// src/pages/Livres.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/axios";
import CardProduit from "../components/CardProduit";

function Livres() {
  const [livres, setLivres] = useState([]);
  const [filteredLivres, setFilteredLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // Charger les livres depuis l'API
  useEffect(() => {
    api.get("/livres/all")
      .then((res) => {
        setLivres(res.data);
        setFilteredLivres(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des livres:", err);
        setLoading(false);
      });
  }, []);

  // Gestion de la recherche
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFilteredLivres(
      livres.filter((livre) =>
        livre.titre.toLowerCase().includes(value)
      )
    );
  };

  // Fonction de logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprime token si utilisé
    navigate("/"); // Redirige vers la page principale
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-700 font-medium">
      Chargement des archives...
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-slate-200 bg-[url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070')] bg-cover bg-center bg-fixed relative"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-0"></div>

      {/* Contenu */}
      <div className="relative z-10 px-6 py-12">
        
        {/* Barre d'outils haut */}
        <div className="flex justify-end gap-3 mb-6">
          <Link
            to="/mes-reservations"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center gap-2"
          >
            📝 Mes Réservations
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Titre */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-3 tracking-tight">
          Bibliothèque Universitaire
        </h1>
        <p className="text-center text-slate-300 mb-12 font-light tracking-wide max-w-lg mx-auto">
          Explorez notre collection de ressources académiques et d'ouvrages de référence.
        </p>

        {/* Recherche */}
        <div className="max-w-xl mx-auto mb-16">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Rechercher un ouvrage, auteur, ISBN..."
            className="w-full px-6 py-4 bg-white/90 border border-slate-200 rounded-full shadow-lg focus:ring-2 focus:ring-indigo-400 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-500"
          />
        </div>

        {/* Liste des livres */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto">
          {filteredLivres.length > 0 ? (
            filteredLivres.map((livre) => (
              <div key={livre._id} className="hover:-translate-y-1 transition-transform duration-300">
                <CardProduit livre={livre} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-16 bg-white/5 backdrop-blur-md rounded-3xl border border-dashed border-slate-700">
              <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-slate-400 text-lg">Aucun ouvrage ne correspond à votre recherche dans la collection.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-24 text-center text-slate-500 text-sm border-t border-slate-800 pt-8 max-w-7xl mx-auto">
            © 2024 Portail de la Bibliothèque Académique - Tous droits réservés.
        </footer>
      </div>
    </div>
  );
}

export default Livres;