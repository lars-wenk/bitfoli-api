const express = require("express");
const request = require("request-promise");
const authenticate = require "../middlewares/authenticate");
let Broker from require("../models/Broker");
const parseErrors = require("../utils/parseErrors");

const router = express.Router();
router.use(authenticate);

router.get("/", (req, res) => {
  Broker.find({ userId: req.currentUser._id }).then(broker => res.json({ broker }));
});

router.post("/", (req, res) => {
  Book.create({ ...req.body.broker, userId: req.currentUser._id })
    .then(broker => res.json({ broker }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

module.exports = router;
