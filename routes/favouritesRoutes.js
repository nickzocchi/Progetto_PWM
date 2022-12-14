const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Mongoose model to use
require("../models/Recipes");
const Recipe = mongoose.model("Recipe");

// All favourites
router.get("/", (request, response) => {
  let hTitle = "Your favourite recipes";
  Recipe.find({
    favourite: true,
  })
    .lean()
    .then((recipe) => {
      response.render("favourites", {
        recipe: recipe,
        headerTitle: hTitle,
      });
    });
});

// Add recipe to favourites
router.get("/add/:name", (request, response) => {
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
  response.redirect("/favourites");
});

// Remove recipe from favourites
router.get("/remove/:id", (request, response) => {
  let filter = { _id: request.params.id };
  let remove = {
    $set: {
      favourite: false,
    },
  };
  let options = { upsert: false, new: false };
  // Find recipe by id and set field "favourite" to false
  Recipe.findOneAndUpdate(filter, remove, options, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      // console.log(results);
    }
    response.redirect("/favourites");
  });
});

module.exports = router;
