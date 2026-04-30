import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Connexion() {
  const [utilisateur, setUtilisateur] = useState({ email: "", motdepasse: "" });
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changerValeur = (e) =>
    setUtilisateur({ ...utilisateur, [e.target.name]: e.target.value });

  const seConnecter = async (e) => {
    e.preventDefault();
    setErreur("");

    if (!utilisateur.email || !utilisateur.motdepasse) {
      setErreur("Veuillez remplir tous les champs.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3001/api/users/login", {
        email: utilisateur.email,
        motDePasse: utilisateur.motdepasse,
      });

      const { token } = response.data;

      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);

      if (decoded.role === "admin") {
        navigate("/AdminDashboard");
      } else if (decoded.role === "employe") {
        navigate("/EmployeDashboard");
      } else {
        navigate("/livres");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErreur(err.response?.data?.message || "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
          alt="Connexion visuelle"
          className="w-2/3 h-auto drop-shadow-lg"
        />
      </div>

      <div className="flex items-center justify-center bg-white p-10">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-4xl font-bold text-blue-800 text-center mb-4">
            Connexion
          </h2>

          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {erreur}
            </div>
          )}

          <form onSubmit={seConnecter} className="space-y-4">
            <label className="block text-gray-700">
              Adresse Email
              <input
                type="email"
                name="email"
                onChange={changerValeur}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <label className="block text-gray-700">
              Mot de passe
              <input
                type="password"
                name="motdepasse"
                onChange={changerValeur}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Vous n'avez pas de compte ?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-semibold"
            >
              Créez-en un ici
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Connexion;