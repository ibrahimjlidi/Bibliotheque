const express = require('express');
const router = express.Router();
const Livre = require('../models/Livre');
const upload = require('../middelweras/upload');

const makeImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${req.protocol}://${req.get('host')}${imagePath}`;
};

const formatLivre = (req, livre) => {
  const livreObj = livre.toObject ? livre.toObject() : livre;
  return {
    ...livreObj,
    image: makeImageUrl(req, livreObj.image),
  };
};

// ----------------- AJOUTER UN LIVRE -----------------
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { titre, auteur, isbn, anneePublication, editeur, langue, description, stock } = req.body;
    const livre = new Livre({
      titre,
      auteur,
      isbn,
      anneePublication,
      editeur,
      langue,
      description,
      stock: stock || 0,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await livre.save();
    res.status(201).json(formatLivre(req, livre));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l’ajout du livre' });
  }
});

// ----------------- GET TOUS LES LIVRES -----------------
router.get('/all', async (req, res) => {
  try {
    const livres = await Livre.find();
    res.json(livres.map(livre => formatLivre(req, livre)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du chargement des livres' });
  }
});

// ----------------- GET LIVRE PAR ID -----------------
router.get('/:id', async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id);
    if (!livre) return res.status(404).json({ error: 'Livre introuvable' });
    res.json(formatLivre(req, livre));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du chargement du livre' });
  }
});

// ----------------- DELETE LIVRE -----------------
router.delete('/:id', async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id);
    if (!livre) return res.status(404).json({ error: 'Livre introuvable' });
    await livre.remove();
    res.json({ message: 'Livre supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression du livre' });
  }
});

// ----------------- UPDATE LIVRE -----------------
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id);
    if (!livre) return res.status(404).json({ error: 'Livre introuvable' });

    const { titre, auteur, isbn, anneePublication, editeur, langue, description, stock } = req.body;
    livre.titre = titre || livre.titre;
    livre.auteur = auteur || livre.auteur;
    livre.isbn = isbn || livre.isbn;
    livre.anneePublication = anneePublication || livre.anneePublication;
    livre.editeur = editeur || livre.editeur;
    livre.langue = langue || livre.langue;
    livre.description = description || livre.description;
    livre.stock = stock || livre.stock;
    if (req.file) livre.image = `/uploads/${req.file.filename}`;

    await livre.save();
    res.json(formatLivre(req, livre));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du livre' });
  }
});

module.exports = router;
