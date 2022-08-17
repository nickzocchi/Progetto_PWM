const { json } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const hbs = require("express-handlebars");
require("dotenv").config();
const session = require("express-session");
const methOver = require("method-override");

const app = express();
app.set("view engine", "handlebars");
app.engine("handlebars", hbs.engine({ defaultLayout: "main" }));

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

// Homepage
app.get("/", (req, res) => {
  let hTitle = "New research";
  res.render("new_search", { headerTitle: hTitle });
});

var data = "";
var res_data = "";

app.post("/", async (request, response) => {
  const query = request.body.input;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.API_Key,
      "X-RapidAPI-Host": process.env.API_Host,
    },
  };
  const url = `https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&q=${query}`;
  const res = await fetch(url, options);
  const data = await res.json();
  console.log(data);
  response.redirect("/search_results");

  // const newRecipe = {
  //   recipes: data.results,
  // };
  // console.log(recipes);
  // new Recipe(newRecipe).save();
  // db.insert(recipes);
  // response.json(recipes);
  //   updateDB(res_data);
});

app.get("/search_results", (request, response) => {
  let hTitle = "Search results";
  response.render("search_results", {
    title: data.results.name,
    headerTitle: hTitle,
  });
});

// // Route to save New Paste
// app.post("/", (req, res) => {
//   const newPaste = {
//   title: req.body.title,
//     pastetext: req.body.pastetext
//   }
//   new Paste(newPaste)
//   .save()
//   .then(nota =>{
//       res.redirect("/list_paste");
//   })
// });

app.listen(3000, () => console.log("In ascolto sulla porta 3000"));
