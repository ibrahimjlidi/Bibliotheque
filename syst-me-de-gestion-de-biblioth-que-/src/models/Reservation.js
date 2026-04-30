const mongoose = require("mongoose")

const reservationSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
      livre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Livre",
      required: true,
    },
    exemplaire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exemplaire",
      required: true,
    },
    dateReservation: {
      type: Date,
      default: Date.now,
    },
    dateExpiration: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    statutReservation: {
      type: String,
      enum: ["en attente", "confirmée", "annulée", "expirée", "complétée"],
      default: "en attente",
    },
    priorite: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Reservation", reservationSchema)