const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Book = require("../models/Book");
const User = require("../models/User");

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

router.get("/exists", (req, res) => {
  Book.find(
    {
      category: {
        $exists: false, //true sadece category olanları getirir. false olmayanları getirir
      },
    },
    "title comments category",
    (err, data) => {
      res.json(data);
    }
  );
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

//limit ilk 2 datayı döndürecektir
router.get("/limit", (req, res) => {
  Book.find({}, (err, data) => {
    res.json(data);
  }).limit(2);
});

//2. kayıttan sonraki kayıtları gösterir
router.get("/skip", (req, res) => {
  Book.find({}, (err, data) => {
    res.json(data);
  }).skip(2);
});

//2. kayıttan sonra 1 tane kayıt göster
router.get("/skipAndlimit", (req, res) => {
  Book.find({}, (err, data) => {
    res.json(data);
  })
    .skip(2)
    .limit(1);
});

//aggregate -- kümeleme
//match publish:true olanları getir
router.get("/match", (req, res) => {
  Book.aggregate(
    [
      {
        $match: {
          published: true,
        },
      },
    ],
    (err, result) => {
      res.json(result);
    }
  );
});

//aggregate -- kümeleme
//group --gruplama işlemi
router.get("/group", (req, res) => {
  Book.aggregate(
    [
      {
        $match: {
          published: true,
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: 1 }, //sum kategorinin toplam kaç adet olduğu
        },
      },
    ],
    (err, result) => {
      res.json(result);
    }
  );
});

//aggregate -- kümeleme
//project --sadece istediğin alan gelir
router.get("/project", (req, res) => {
  Book.aggregate(
    [
      {
        $match: {
          published: false,
        },
      },
      {
        $project: {
          title: 1, //sadece title ve meta gelir 1 veya true kullanılır
          meta: true,
        },
      },
      {
        $sort: { title: -1 },
      },
      {
        $limit: 5,
      },
      {
        $skip: 1,
      },
    ],
    (err, result) => {
      res.json(result);
    }
  );
});

// INNER JOIN --lookup
router.get("/lookup", (req, res) => {
  Book.aggregate(
    [
      {
        $match: {
          _id: mongoose.Types.ObjectId("5fa6717972f75f4cc4f85fa7"),
          //id ye göre match edilecekse mongoosetypeobjectid kulanılmalı
        },
      },
      {
        $lookup: {
          from: "users", //hangi tabloyla join yapılacagı
          localField: "user_id", //Book tablondaki hangi alanı eşleştireceksin
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          title: true,
          // username: "$user.fullname", // sadece fullname gelir
          user: "$user",
        },
      },
    ],
    (err, result) => {
      res.json(result);
    }
  );
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
