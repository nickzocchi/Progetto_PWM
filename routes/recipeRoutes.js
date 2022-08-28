const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

require("../models/Recipes");
const Recipe = mongoose.model("Recipe");

// Manual recipe inserted
router.post("/new", (request, response) => {
  console.log(request.body.image);
  const manRecipe = {
    name: request.body.name,
    recipe: request.body.recipe,
    image: request.body.image,
    description: request.body.description,
    favourite: true,
  };
  // console.log(manRecipe);
  new Recipe(manRecipe).save();
  response.redirect("/favourites");
});

// Manual recipe page
router.get("/manual", (request, response) => {
  let hTitle = "New manual recipe";
  response.render("manual_recipe", {
    headerTitle: hTitle,
  });
});

// View recipe by name
router.get("/view/:name", (request, response) => {
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

module.exports = router;
