const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messageData: {
      subject: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      response: String,
      status: {
        type: String,
        enum: ["new", "in_progress", "resolved"],
        default: "new",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
