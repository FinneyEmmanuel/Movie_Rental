const express = require("express");
const Joi = require("joi");
const router = express.Router();
const { Customer, validateCustomer } = require("../models/customerModel");
router.get("/", async (req, res) => {
  try {
    const customer = await Customer.find({});
    if (!customer) return res.status(404).send("Customer not found");
    res.send(customer);
  } catch (error) {
    res.send(error.message);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById({ _id: req.params.id });
    if (!customer) return res.status(404).send("Customer not found");
    res.send(customer);
  } catch (error) {
    res.send(error.message);
  }
});
router.post("/", async (req, res) => {
  try {
    const customer = new Customer({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    });
    const { error } = validateCustomer(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    await customer.save();
    res.send(customer);
  } catch (error) {
    res.send(error.message);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          phone: req.body.phone,
          isGold: req.body.isGold,
        },
      },
      { new: true }
    );
    if (!customer) {
      return res.status(404).send("Customer not found");
    } else {
      res.send(customer);
    }
  } catch (error) {
    res.send(error.message);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).send("Customer not found");
    } else {
      res.send(customer);
    }
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
