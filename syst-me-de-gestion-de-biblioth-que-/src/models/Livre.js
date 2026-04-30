const mongoose = require('mongoose');

const livreSchema = mongoose.Schema(
  {
    titre: { type: String, required: true },
    auteur: { type: String, required: true },
    isbn: { type: Number, unique: true },
     statutLivre: {
      type: String,
      enum: ["disponible", "indisponible"],
      default: "disponible",
    },
    anneePublication: { type: Date },
    editeur: { type: String },
    langue: { type: String, required: true },
    description: { type: String },
    image: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: props => `${props.value} n'est pas un fichier image valide.`,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Livre', livreSchema);
