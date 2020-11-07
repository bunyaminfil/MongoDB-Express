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

//get all data
router.get("/all", (req, res) => {
  Book.find({}, (err, data) => {
    res.json(data);
  });
});

router.get("/search", (req, res) => {
  Book.find({ published: false }, (err, data) => {
    res.json(data);
  });
});

router.get("/searchOne", (req, res) => {
  Book.findOne({ title: "Küçük Prens" }, (err, data) => {
    res.json(data);
  });
});

router.get("/searchById", (req, res) => {
  Book.findById("5fa56063315cce912c431eab", (err, data) => {
    res.json(data);
  });
});

//sıralama -1, 1 a'dan z'ye , büyükten küçüğe vb.
router.get("/sort", (req, res) => {
  Book.find({}, (err, data) => {
    res.json(data);
  }).sort({ title: 1 });
});

// //Book.update ilk bulduğu kaydı günceller
// router.put("/update", (req, res) => {
//   Book.update({ published: false }, { published: true }, (err, data) => {
//     res.json(data);
//   });
// });

//birden fazla alanda güncelleme için multi keyword kullanılması gerekli
router.put("/updateall", (req, res) => {
  Book.update(
    { published: false },
    { published: true },
    { multi: true },
    (err, data) => {
      res.json(data);
    }
  );
});

//upsert keywordu verilen datada kayıt yoksa kendisi oluşturur
router.put("/update", (req, res) => {
  Book.update(
    { published: false },
    { published: true, title: "Hayvan mezarlığı" },
    { upsert: true },
    (err, data) => {
      res.json(data);
    }
  );
});

router.put("/updateById", (req, res) => {
  Book.findByIdAndUpdate(
    "5fa56063315cce912c431eab",
    { title: "Küçük Prens", "meta.favs": 99 },
    (err, data) => {
      res.json(data);
    }
  );
});

//id ye göre siler
router.delete("/remove", (req, res) => {
  Book.findById("5fa68637d96e264236ce9163", (err, book) => {
    book.remove((err, data) => {
      res.json(data);
    });
  });
});

//published:true ilk bulduğu datayı siler
router.delete("/removefirst", (req, res) => {
  Book.findOneAndRemove({ published: true }, (err, data) => {
    res.json(data);
  });
});

//published:false olan tüm kayıtları siler
router.delete("/removeall", (req, res) => {
  Book.remove({ published: false }, (err, data) => {
    res.json(data);
  });
});

module.exports = router;
