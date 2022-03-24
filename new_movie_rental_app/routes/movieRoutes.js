const express = require("express");
const res = require("express/lib/response");
const Joi = require("joi");
const { Genre } = require("../models/genreModel");
const router = express.Router();
const { Movie, validateMovie } = require("../models/movieModel");

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    if (!movies) return res.status(404).send("Oye Movies not found :(");
    res.send(movies);
  } catch (error) {
    res.send(error.message);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Oye Movie not found :(");
    res.send(movie);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateMovie(req.body);
    if (error) {
      return res.status(404).send(error.details[0].message);
    }
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send("Genre not found");
    const movie = new Movie({
      title: req.body.title,
      dailyRentalRate: req.body.dailyRentalRate,
      numberInStocks: req.body.numberInStocks,
      genre: {
        name: genre.name,
        _id: genre._id,
      },
    });
    await movie.save();
    res.send(movie);
  } catch (error) {
    res.send(error.message);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { error } = validateMovie(req.body);
    if (error) return res.status(404).send(error);
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send("Please check genreId");
    const _id = req.params.id;
    const movie = await Movie.findByIdAndUpdate(
      _id,
      {
        $set: {
          title: req.body.title,
          genre: {
            name: genre.name,
            _id: genre._id,
          },
          dailyRentalRate: req.body.dailyRentalRate,
          numberInStocks: req.body.numberInStocks,
        },
      },
      { new: true }
    );
    res.send(movie);
  } catch (error) {
    res.send(error.message);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const movie = await Movie.findByIdAndDelete(_id);
    if (!movie) return res.status(404).send("Couldn't find movie");
    res.send(movie);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
