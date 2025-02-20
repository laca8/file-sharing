const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    folderId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "folder",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 0,
    },

    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("file", fileSchema);
