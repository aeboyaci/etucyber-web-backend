const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_URL;

const app = express();
mongoose.connect(DB_URL);

app.use(cookieParser());
app.use("*", (req, resp, next) => {
   console.log("origin", req.headers.origin);
   console.log("host", req.headers.host);
   next();
})
app.use(cors({
   origin: ["http://localhost:5555", "http://localhost:80", "http://92.205.16.57:5555", "http://92.205.16.57:80"],
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