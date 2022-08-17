const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  recipe: {},
  datetime: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("Recipe", recipeSchema);
