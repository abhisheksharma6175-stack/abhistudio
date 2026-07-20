const mongoose = require("mongoose");

const stylistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    bio: { type: String },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stylist", stylistSchema);
