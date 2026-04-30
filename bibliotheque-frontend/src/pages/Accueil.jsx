import { Link } from "react-router-dom";

function Bienvenue() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-200 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-blue-800 mb-4">
        🎉 Bienvenue à la Bibliothèque
      </h1>
      <p className="text-gray-700 max-w-2xl text-lg md:text-xl mb-8">
        Explorez un système moderne de gestion de bibliothèque conçu pour les étudiants, le personnel et les fournisseurs. Accédez facilement aux livres, emprunts et services.
      </p>

      <ul className="text-left text-gray-600 mb-10 space-y-2 text-base md:text-lg">
        <li>📖 Recherche et consultation de livres</li>
        <li>📝 Gestion des emprunts et retours</li>
        <li>👨‍🏫 Accès personnalisé pour étudiants, employés et fournisseurs</li>
        <li>📊 Statistiques et historique des activités</li>
      </ul>

      <div className="flex gap-5">
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition shadow-md"
        >
          Se connecter
        </Link>
        <Link
          to="/register"
          className="bg-white border border-blue-600 text-blue-700 font-medium py-2 px-6 rounded-full transition hover:bg-blue-50 shadow-md"
        >
          S'inscrire
        </Link>
        <Link
  to="/livres"
  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-xl font-semibold rounded-xl shadow-lg transition hover:scale-105"
>
  Parcourir les livres
</Link>
      </div>
    </div>
  );
}

export default Bienvenue;

