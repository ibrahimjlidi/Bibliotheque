const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

// =====================
// Génération Token JWT
// =====================
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// =====================
// Création utilisateur (admin uniquement)
// =====================
const createUser = async (req, res) => {
  try {
    const {
      nom, prenom, email, motDePasse, role,
      matricule, departement, roleEmploye,
      numeroEtudiant, filiere, niveauEtude, maxEmprunts,
      nomEntreprise, siret, adresseEntreprise, contactPrincipal
    } = req.body;

    if (!["employe", "etudiant", "supplier", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role invalide." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const user = new User({
      nom, prenom, email, motDePasse: hashedPassword, role,
      matricule, departement, roleEmploye,
      numeroEtudiant, filiere, niveauEtude, maxEmprunts,
      nomEntreprise, siret, adresseEntreprise, contactPrincipal
    });

    await user.save();
    const token = generateToken(user);

    const userResponse = user.toObject();
    delete userResponse.motDePasse;

    res.status(201).json({ message: "Utilisateur créé", user: userResponse, token });

  } catch (error) {
    console.error("Erreur createUser:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// =====================
// Inscription publique
// =====================
const register = async (req, res) => {
  try {
    console.log("Body reçu:", req.body);
    console.log("Fichier reçu:", req.file);

    const {
      nom,
      prenom,
      email,
      motDePasse,
      role = "etudiant", // valeur par défaut
      matricule,
      departement,
      roleEmploye,
      numeroEtudiant,
      filiere,
      niveauEtude,
      nomEntreprise,
      siret,
      adresseEntreprise,
      contactPrincipal
    } = req.body;

    // Vérifier si email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé." });
    }

    // Hash mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    // Image profil (gérée par multer)
    const imageProfil = req.file ? req.file.filename : null;

    // Création user
    const userData = {
      nom,
      prenom,
      email,
      motDePasse: hashedPassword,
      role,
      imageProfil,
    };

    // Règles dynamiques selon rôle
    if (role === "etudiant") {
      userData.numeroEtudiant = numeroEtudiant;
      userData.filiere = filiere;
      userData.niveauEtude = niveauEtude;
      userData.maxEmprunts = 3;
    }

    if (role === "employe") {
      userData.matricule = matricule;
      userData.departement = departement;
      userData.roleEmploye = roleEmploye;
    }

    if (role === "supplier") {
      userData.nomEntreprise = nomEntreprise;
      userData.siret = siret;
      userData.adresseEntreprise = adresseEntreprise;
      userData.contactPrincipal = contactPrincipal;
    }

    const newUser = new User(userData);
    await newUser.save();

    const token = generateToken(newUser);

    const userResponse = newUser.toObject();
    delete userResponse.motDePasse;

    res.status(201).json({
      message: "Inscription réussie",
      user: userResponse,
      token,
    });

  } catch (error) {
    console.error("Erreur register:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// =====================
// Connexion
// =====================
const login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    if (!email || !motDePasse) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email ou mot de passe incorrect." });

    if (user.statut !== "actif") {
      return res.status(401).json({ message: "Compte inactif." });
    }

    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect." });

    const token = generateToken(user);

    const userResponse = user.toObject();
    delete userResponse.motDePasse;

    res.json({ message: "Connexion réussie", user: userResponse, token });

  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// =====================
// Get all users (admin)
// =====================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// Get user by ID (admin)
// =====================
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// Update user (admin)
// =====================
const updateUser = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.motDePasse) {
      updates.motDePasse = await bcrypt.hash(updates.motDePasse, 10);
    }

    if (req.file) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

      if (user.imageProfil) {
        const oldPath = path.join(__dirname, "../uploads", user.imageProfil);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      updates.imageProfil = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "Utilisateur non trouvé." });

    res.json({ message: "Utilisateur mis à jour", user: updatedUser });

  } catch (error) {
    console.error("Erreur updateUser:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// =====================
// Update profil connecté
// =====================
const updateMe = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.motDePasse) updates.motDePasse = await bcrypt.hash(updates.motDePasse, 10);

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    const userResponse = user.toObject();
    delete userResponse.motDePasse;

    res.json({ message: "Profil mis à jour", user: userResponse });
  } catch (error) {
    console.error("Erreur updateMe:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// =====================
// Supprimer utilisateur (admin)
// =====================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });
    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    console.error("Erreur deleteUser:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = {
  createUser,
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  updateMe,
  deleteUser,
};
