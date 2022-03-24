const mongoose = require("mongoose");
const Joi = require("joi");
const joiObjectid = require("joi-objectid");

const rentalSchema = new mongoose.Schema({
  customer: new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    phone: {
      type: String,
      required: true,
      minlength: 7,
      maxlength: 10,
    },
  }),
  movie: new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    dailyRentalRate: {
      type: String,
      required: true,
      min: 0,
      max: 255,
    },
  }),
  dateOut: {
    type: Date,
    default: Date.now,
  },
  dateIn: {
    type: Date,
    default: null,
  },
  rentalFee: {
    type: Number,
    min: 0,
    max: 2000,
    required: true,
  },
});

const Rental = new mongoose.model("Rentals", rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;
