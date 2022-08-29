const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Mongoose model to use
require("../models/Recipes");
const Recipe = mongoose.model("Recipe");

// Homepage
router.get("/", (request, response) => {
  let hTitle = "Enter your ingredients";
  response.render("new_search", { headerTitle: hTitle });
});

router.post("/", async (request, response) => {
  var all_rec = [];
  const num = request.body.rec_num;
  const query = request.body.input;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.API_Key,
      "X-RapidAPI-Host": process.env.API_Host,
    },
  };
  const url = `https://${process.env.API_Host}/recipes/list?from=0&size=${num}&q=${query}`;
  const api_res = await fetch(url, options);
  let data = await api_res.json();

  // Stringify then search and remove HTML tags
  let data2 = JSON.stringify(data);
  someString = data2.replace(/<\/?[^>]+(>|$)/g, "");
  data = JSON.parse(someString);

  // For each result in the response, push each result in the all_rec array
  data.results.forEach((result) => {
    // If a "recipe" is actually an article with multiple recipes inside, skip pushing
    if (Array.isArray(result.recipes) === false) {
      all_rec.push(result);
    } else {
    }
  });

  // For each recipe in the array, push the nested components array to be in the ingredients field
  all_rec.forEach((recipe) => {
    recipe.sections.forEach((section) => {
      recipe.ingredients = section.components;
    });
  });
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
    // Add a recipe to the database only if a recipe with the same name doesn't exist
    Recipe.findOneAndUpdate(filter, rec, options, function (err, results) {
      if (err) {
        console.log(err);
      } else {
        // console.log(results);
      }
    });
  });
  let hTitle = "Search results";
  response.render("search_results", {
    number: num,
    headerTitle: hTitle,
    recipe: all_rec,
    instr: all_rec.instructions,
  });
});

module.exports = router;
