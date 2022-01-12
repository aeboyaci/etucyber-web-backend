const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_URL;

const app = express();
mongoose.connect(DB_URL);

app.use(cookieParser());
app.use(cors({
   origin: ["http://localhost:3000", "http://92.205.16.57", "https://92.205.16.57"],
   credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded( { extended: true } ));

const api = express.Router();
app.use("/api", api);

const PostsRoute = require("./routes/posts");
api.use("/posts", PostsRoute);

const AccountRoute = require("./routes/account");
api.use("/account", AccountRoute);

app.listen(PORT, () => {
   console.log("Listening on port " + PORT);
});