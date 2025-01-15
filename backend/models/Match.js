const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchData: {
      book: {
        title: String,
        author: String,
      },
      movie: {
        title: String,
        year: String,
        overview: String,
        posterPath: String,
      },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Match", matchSchema);
