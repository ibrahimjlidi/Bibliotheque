const mongoose = require('mongoose');

const commandeFournisseurSchema = mongoose.Schema({
  dateCommande: {
    type: Date,
    default: Date.now
  },
  statut: {
    type: String,
    enum: ['En attente', 'Livrée', 'Annulée'],
    default: 'En attente'
  },
  fournisseurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fournisseur',
    required: true
  },
  employeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employe',
    required: true
  },
  montantTotal: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CommandeFournisseur', commandeFournisseurSchema);
