import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [infos, setInfos] = useState({
    nom: "",
    prenom: "",
    email: "",
    motdepasse: "",
    confirmation: "",
    role: "etudiant", // rôle par défaut
  });

  const rolesAllowedForSignup = ["etudiant", "employe"];
  // ⚠️ في production من الأفضل: ["etudiant", "employe"]

  const [imageProfil, setImageProfil] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Gestion des champs texte
  const changerChamp = (e) =>
    setInfos({ ...infos, [e.target.name]: e.target.value });

  // Gestion de l'image
  const handleFileChange = (e) => {
    setImageProfil(e.target.files[0]);
  };

  // Soumission formulaire
  const validerInscription = async (e) => {
    e.preventDefault();

    if (infos.motdepasse !== infos.confirmation) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    const formData = new FormData();
    formData.append("nom", infos.nom);
    formData.append("prenom", infos.prenom);
    formData.append("email", infos.email);
    formData.append("motDePasse", infos.motdepasse);
    formData.append("role", infos.role); // ✅ role dynamique
    if (imageProfil) formData.append("imageProfil", imageProfil);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3001/api/users/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Inscription réussie !");
      console.log("Réponse serveur:", res.data);
      navigate("/login");

    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de l'inscription";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-purple-100 via-white to-blue-100 px-6 py-10">
      {/* Partie gauche */}
      <div className="hidden md:flex flex-col w-1/2 p-10 space-y-6">
        <h1 className="text-4xl font-bold text-purple-700">
          Rejoignez EPI Library
        </h1>
        <p className="text-gray-700 text-lg">
          Créez votre compte pour accéder à notre bibliothèque intelligente.
        </p>
      </div>

      {/* Partie droite */}
      <div className="w-full md:w-1/2 max-w-md bg-white p-8 rounded-3xl shadow-2xl">
        <form
          onSubmit={validerInscription}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <input type="text" name="nom" placeholder="Nom" onChange={changerChamp} required className="input" />
          <input type="text" name="prenom" placeholder="Prénom" onChange={changerChamp} required className="input" />
          <input type="email" name="email" placeholder="Adresse Email" onChange={changerChamp} required className="input" />
          <input type="password" name="motdepasse" placeholder="Mot de passe" onChange={changerChamp} required className="input" />
          <input type="password" name="confirmation" placeholder="Confirmer le mot de passe" onChange={changerChamp} required className="input" />

          {/* ✅ AJOUT : Type de compte */}
          <label className="block text-gray-700 font-semibold">
            Type de compte
            <select
              name="role"
              value={infos.role}
              onChange={changerChamp}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400"
              required
            >
              {rolesAllowedForSignup.map((r) => (
                <option key={r} value={r}>
                  {r === "etudiant"
                    ? "Étudiant"
                    : r === "employe"
                    ? "Employé"
                    : "Administrateur"}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-gray-700 font-semibold">
            Image de profil (optionnel)
            <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-lg"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-purple-700 font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
