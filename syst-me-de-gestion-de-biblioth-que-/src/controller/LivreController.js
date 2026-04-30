
const Livre = require('../models/Livre');


async function createLivre(req, res) {
  try {
    const { titre, auteur, isbn, anneePublication, editeur, langue, description } = req.body;
    const image = req.file ? req.file.filename : null; // Get uploaded image filename

    const livre = new Livre({
      titre,
      auteur,
      isbn,
      anneePublication,
      editeur,
      langue,
      description,
      image,
    });

    await livre.save();
    res.status(201).json(livre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


async function getAllLivres(req, res) {
  try {
    const livres = await Livre.find();
    res.json(livres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getLivreById(req, res) {
  try {
    const livre = await Livre.findById(req.params.id);
    if (!livre) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.json(livre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateLivre(req, res) {
  try {
    const livre = await Livre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!livre) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.json(livre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteLivre(req, res) {
  try {
    const livre = await Livre.findByIdAndDelete(req.params.id);
    if (!livre) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.json({ message: 'Livre supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createLivre,
  getAllLivres,
  getLivreById,
  updateLivre,
  deleteLivre
};
