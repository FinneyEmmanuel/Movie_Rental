const express = require("express");
const Joi = require("joi");
const { Customer } = require("../models/customerModel");
const { Movie } = require("../models/movieModel");
const router = express.Router();
const { Rental, validateRental } = require("../models/rentalModel");

router.get("/", async (req, res) => {
  try {
    const rental = await Rental.find();
    if (!rental) return res.status(404).send("No Rental found");
    res.send(rental);
  } catch (error) {
    res.send(error.message);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send("No Rental found");
  } catch (error) {
    res.send(error.message);
  }
});
router.post("/", async (req, res) => {
  try {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send("Please check the customerId");
    const movie = await Movie.findById(req.body.movieId);
    console.log(movie);
    if (!movie) return res.status(404).send("Please check the MovieId");

    if (movie.numberInStock == 0)
      return res.status(400).send("Movie out of stock");

    const rental = new Rental({
      customer: {
        name: customer.name,
        phone: customer.phone,
        _id: customer._id,
      },
      movie: {
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
        _id: movie._id,
      },
      rentalFee: movie.dailyRentalRate * 10,
    });
    const session = await Rental.startSession();
    session.startTransaction();
    try {
      await rental.save();
      await Movie.findByIdAndUpdate(movie._id, { $inc: { numberInStock: -1 } });
      session.commitTransaction();
      session.endSession();
      res.send(rental);
    } catch (error) {
      session.abortTransaction();
      session.endSession();
      return res.status(500).send("something has failed");
    }
    // await rental.save();
    // res.send(rental);
  } catch (error) {
    res.send(error.message);
  }
});

router.patch("/:id", async (req, res) => {
  const _id = req.params.id;
  const session = await Rental.startSession();
  session.startTransaction();
  try {
    const rental = await Rental.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          dateIn: req.body.currentDate,
        },
      },
      { new: true }
    );
    const _id = rental.movie._id;
    await Movie.findByIdAndUpdate(_id, {
      $inc: { numberInStocks: 1 },
    });

    session.commitTransaction();
    session.endSession();
    res.send(rental);
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    return res.status(500).send(error);
  }
});
router.delete("/:id", async (req, res) => {
  // const _id : req.params.id
  const session = await Rental.startSession();
  session.startTransaction();
  try {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if (!rental) return res.status(404).send("Rental not found");
    await Movie.findByIdAndUpdate(
      rental.movie._id,
      {
        $inc: { numberInStock: 1 },
      },
      { new: true }
    );
    session.commitTransaction();
    session.endSession();
    res.send(rental);
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    return res.status(500).send(error);
  }
});
module.exports = router;
