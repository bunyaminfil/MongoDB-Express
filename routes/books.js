const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.post("/", function (req, res, next) {
  const book = new Book({
    title: "Küçük Prens",
    published: false,
    comments: [
      {
        message: "Harika bir kitap",
      },
      {
        message: "Beğenmedim",
      },
    ],
    meta: {
      votes: 12,
      favs: 104,
    },
  });

  book.save((err, data) => {
    if (err) console.log(err);
    res.json(data);
  });
});

module.exports = router;
