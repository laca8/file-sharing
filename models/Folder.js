const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    files: [],
    name: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    maxSize: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("folder", folderSchema);
