const express = require("express");
const mongoose = require("mongoose");
const hbs = require("express-handlebars");
const { json, response } = require("express");
const session = require("express-session");
const methOver = require("method-override");
require("dotenv").config();
const helpers = require("handlebars-helpers")();
const path = require("path");
const port = process.env.port;

const app = express();

const data = "";
var res_data = "";

// const Datastore = require("nedb");
// const db = new Datastore("./database.db");
// db.loadDatabase();
app.use("*/js", express.static(__dirname + "/assets/js"));
app.use("*/plugins", express.static(__dirname + "/assets/plugins"));
app.use("*/css", express.static(__dirname + "/assets/css"));
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

require("./models/Recipes");
const Recipe = mongoose.model("Recipe");

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
  })
);

// Homepage
app.get("/", (req, res) => {
  let hTitle = "Enter your ingredients";
  res.render("new_search", { headerTitle: hTitle });
});

app.post("/", async (request, response) => {
  // const query = request.body.input;
  // const options = {
  //   method: "GET",
  //   headers: {
  //     "X-RapidAPI-Key": process.env.API_Key,
  //     "X-RapidAPI-Host": process.env.API_Host,
  //   },
  // };
  // const url = `https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&q=${query}`;
  // const res = await fetch(url, options);
  // const data = await res.json();
  // console.log(data);
  var data = "ciao";
  response.redirect("/search_results");

  // const newRecipe = {
  //   name: data.results.name,
  //   recipe: data.results.instructions,
  // };
  // console.log(recipes);
  // new Recipe(newRecipe).save();
  // db.insert(recipes);
  // response.json(recipes);
  //   updateDB(res_data);
});

app.post("/new_recipe", (request, response) => {
  const manRecipe = {
    name: request.body.name,
    recipe: request.body.recipe,
  };
  // new Recipe(manRecipe).save();
  response.redirect("/favourites");
});

app.get("/search_results", (request, response) => {
  let hTitle = "Search results";
  console.log(data);
  response.render("search_results", {
    headerTitle: hTitle,
  });
});

app.get("/manual_recipe", (request, response) => {
  let hTitle = "New manual recipe";
  response.render("manual_recipe", {
    headerTitle: hTitle,
  });
});

app.get("/favourites", (request, response) => {
  let hTitle = "Your favourite recipes";
  response.render("favourites", {
    // title: data.results.name,
    headerTitle: hTitle,
  });
});

app.listen(port, () => console.log(`Server running on ${port}`));
