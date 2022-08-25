const express = require("express");
const mongoose = require("mongoose");
const hbs = require("express-handlebars");
const { json, response } = require("express");
const session = require("express-session");
const methOver = require("method-override");
const bodyParser = require("body-parser");
require("dotenv").config();
const helpers = require("handlebars-helpers")();
const path = require("path");
const { request } = require("http");
const port = process.env.port;

const app = express();

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

require("./models/Recipes");
const Recipe = mongoose.model("Recipe");

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

// Homepage
app.get("/", (request, response) => {
  let hTitle = "Enter your ingredients";
  response.render("new_search", { headerTitle: hTitle });
});

app.post("/", async (request, response) => {
  var all_rec = [];
  const query = request.body.input;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.API_Key,
      "X-RapidAPI-Host": process.env.API_Host,
    },
  };
  const url = `https://${process.env.API_Host}/recipes/list?from=0&size=9&q=${query}`;
  const api_res = await fetch(url, options);
  let data = await api_res.json();

  // Stringify then search and remove HTML tags
  let data2 = JSON.stringify(data);
  someString = data2.replace(/<\/?[^>]+(>|$)/g, "");
  data = JSON.parse(someString);

  data.results.forEach((result) => {
    if (Array.isArray(result.recipes) === false) {
      all_rec.push(result);
    } else {
      result.recipes.forEach((recipe) => {
        all_rec.push(recipe);
      });
    }
  });

  //For each recipe in the array, push the nested components array to be in the ingredients field
  all_rec.forEach((recipe) => {
    recipe.sections.forEach((section) => {
      recipe.ingredients = section.components;
    });
  });
  console.log(all_rec);

  all_rec.forEach((recipe) => {
    const rec = {
      $set: {
        name: recipe.name,
        recipe: recipe.instructions,
        image: recipe.thumbnail_url,
        description: recipe.description,
        ingredients: recipe.ingredients,
      },
    };
    let filter = { name: recipe.name };
    let options = { upsert: true, new: true };
    Recipe.findOneAndUpdate(filter, rec, options, function (err, results) {
      if (err) {
        console.log(err);
      } else {
        // console.log(results);
      }
    });
  });

  let hTitle = "Search results";
  // response.json(all_rec);
  response.render("search_results", {
    headerTitle: hTitle,
    recipe: all_rec,
    instr: all_rec.instructions,
  });
});

app.post("/new_recipe", (request, response) => {
  // console.log(request.body);
  const manRecipe = {
    name: request.body.name,
    recipe: request.body.recipe,
    favourite: true,
  };
  // console.log(manRecipe);
  new Recipe(manRecipe).save();
  response.redirect("/favourites");
});

app.get("/manual_recipe", (request, response) => {
  let hTitle = "New manual recipe";
  response.render("manual_recipe", {
    headerTitle: hTitle,
  });
});

app.get("/favourites", (request, response) => {
  let hTitle = "Your favourite recipes";
  Recipe.find({
    favourite: true,
  })
    .lean()
    .then((recipe) => {
      // console.log(recipe);
      response.render("favourites", {
        recipe: recipe,
        headerTitle: hTitle,
      });
    });
});

app.get("/view_recipe/:name", (request, response) => {
  let hTitle = "View recipe";
  // console.log(request.params.name);
  Recipe.findOne({
    name: request.params.name,
  })
    .lean()
    .then((recipe) => {
      console.log(recipe);
      response.render("view_recipe", {
        recipe: recipe,
        headerTitle: hTitle,
      });
    });
});

app.get("/add_favourite/:name", (request, response) => {
  console.log(request.params.name);
  let filter = { name: request.params.name };
  let fav = {
    $set: {
      favourite: true,
    },
  };
  let options = { upsert: false, new: true };
  Recipe.findOneAndUpdate(filter, fav, options, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      // console.log(results);
    }
  });
  response.send();
});

app.get("/remove_favourite/:id", (request, response) => {
  Recipe.deleteOne({
    _id: request.params.id,
  }).then((note) => {
    response.redirect("/favourites");
  });
});

app.listen(port, () => console.log(`Server running on ${port}`));
