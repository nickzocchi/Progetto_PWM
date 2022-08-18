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
  favourite: {
    type: Boolean,
    default: false,
  },
});

mongoose.model("Recipe", recipeSchema);
