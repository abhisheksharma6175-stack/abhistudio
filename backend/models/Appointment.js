const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    stylist: { type: mongoose.Schema.Types.ObjectId, ref: "Stylist", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
