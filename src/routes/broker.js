import express from "express";
import request from "request-promise";
import authenticate from "../middlewares/authenticate";
import Book from "../models/Broker";
import parseErrors from "../utils/parseErrors";

const router = express.Router();
router.use(authenticate);

router.get("/", (req, res) => {
  Broker.find({ userId: req.currentUser._id }).then(broker => res.json({ books }));
});

router.post("/", (req, res) => {
  Book.create({ ...req.body.broker, userId: req.currentUser._id })
    .then(book => res.json({ broker }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

export default router;
