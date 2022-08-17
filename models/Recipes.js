const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  recipes: {},
  datetime: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("Recipe", recipeSchema);
