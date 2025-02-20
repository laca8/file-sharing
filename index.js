const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const globalError = require("./middlewares/errorhandler");
dotenv.config();
const connDb = require("./config/db");

const ApiError = require("./utils/apiError");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
connDb();

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "./client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is running...");
  });
}
app.use("/api/user", require("./routes/user"));
app.use("/api/file", require("./routes/file"));
app.use("/api/folders", require("./routes/folder"));
app.use("*", (req, res, next) => {
  next(new ApiError("this route not found", 404));
});
app.use(globalError);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running at port ${PORT}...`);
});
