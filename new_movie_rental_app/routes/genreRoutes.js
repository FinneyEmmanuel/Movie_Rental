const express = require("express");
const Joi = require("joi");
const router = express.Router();
const { Genre, validateGenre } = require("../models/genreModel");
router.get("/", async (req, res) => {
  try {
    const genre = await Genre.find({});
    if (!genre) {
      return res.send("Genre not found");
    } else {
      res.send(genre);
    }
  } catch (error) {
    res.send(error.message);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.find({ _id: req.params.id });
    if (!genre) {
      return res.send("Genre not found");
    } else {
      res.send(genre);
    }
  } catch (error) {
    res.send(error.message);
  }
});
router.post("/", async (req, res) => {
  try {
    const { error } = validateGenre(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    const genre = new Genre({
      name: req.body.name,
    });

    await genre.save();
    res.send(genre);
  } catch (error) {
    res.send(error.message);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { error } = validateGenre(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: { name: req.body.name },
      }
    );
    if (!genre) {
      return res.send("Genre not found");
    } else {
      res.send(genre);
    }
  } catch (error) {
    res.send(error.message);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete({ _id: req.params.id });
    if (!genre) {
      return res.send("Genre not found");
    } else {
      res.send(genre);
    }
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
