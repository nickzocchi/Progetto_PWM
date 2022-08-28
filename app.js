// Handlebars
const hbs = require("express-handlebars");
const helpers = require("handlebars-helpers")();

// Mongoose to connect to MongoDB
const mongoose = require("mongoose");

// Misc
const methOver = require("method-override");
const bodyParser = require("body-parser");
require("dotenv").config();
const path = require("path");

// Express
const express = require("express");
const port = process.env.port;
const app = express();
const favouritesRoutes = require("./routes/favouritesRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const homeRoutes = require("./routes/homeRoutes");

app.use("*/assets", express.static(__dirname + "/assets/"));
app.use("*/js", express.static(__dirname + "/assets/js"));
app.use("*/plugins", express.static(__dirname + "/assets/plugins"));
app.use("*/css", express.static(__dirname + "/assets/css"));
app.use("*/modules", express.static(__dirname + "/node_modules"));
app.use("*/images", express.static(__dirname + "/assets/images"));

app.use(express.json());

mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://localhost:27017/Recipes",
  { useNewUrlParser: true },
  function (error) {
    if (error) {
      return console.error(error);
    }
    console.log("Connected to MongoDB!");
  }
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methOver("_method"));

app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
  })
);

app.use("/", homeRoutes);
app.use("/recipe", recipeRoutes);
app.use("/favourites", favouritesRoutes);

app.listen(port, () => console.log(`Server running on ${port}`));
