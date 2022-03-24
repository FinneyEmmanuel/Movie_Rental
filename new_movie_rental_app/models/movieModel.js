const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { genreSchema } = require("./genreModel");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    min: 5,
    max: 225,
    required: true,
    trim: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 255,
    required: true,
  },
  numberInStocks: {
    type: Number,
    min: 0,
    max: 255,
    required: true,
  },
});

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(225).required(),
    genreId: Joi.string(),
    dailyRentalRate: Joi.string().min(0).max(255).required(),
    numberInStocks: Joi.string().min(0).max(255).required(),
  });
  return schema.validate(movie);
}

const Movie = new mongoose.model("Movies", movieSchema);
module.exports.movieSchema = movieSchema;
module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
