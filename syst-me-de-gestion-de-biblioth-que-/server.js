const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // ✅ pour gérer les requêtes cross-origin
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const amendeRoutes = require('./src/routes/AmendeRoutes');
const categorieRoutes = require('./src/routes/CategorieRoutes');
const commandeRoutes = require('./src/routes/CommandeFournisseurRoutes');
const livreRoutes = require('./src/routes/LivreRoutes');
const notificationRoutes = require('./src/routes/NotificationRoutes');
const exemplaireRoutes = require('./src/routes/ExemplaireRoutes');
const reservationRoutes = require('./src/routes/ReservationRoutes');
const path = require('path');


dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express(); // ⚠️ doit être défini AVANT les app.use

// Middleware CORS
app.use(cors({
  origin: 'http://localhost:5174', // ton frontend Vite
  credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json());

// Rendre le dossier uploads accessible publiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => res.send('Backend opérationnel'));
app.use('/api/users', userRoutes);
app.use('/api/amendes', amendeRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/livres', livreRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/exemplaires', exemplaireRoutes);
app.use('/api/reservations', reservationRoutes);

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
