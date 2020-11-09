const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  user_id: {
    type: String, //type:mongoose.Schema.Types.ObjectId
  },
  title: {
    type: String,
    required: true,
    maxlength: [
      10,
      "{PATH} alanı (`{VALUE}`) ({MAXLENGTH}) karakterden küçük olmalıdır",
    ],
    minlength: [
      2,
      "{PATH} alanı (`{VALUE}`) ({MINLENGTH}) karakterden büyük olmalıdır",
    ],
    //unique: true,
  },
  year: {
    type: Number,
    max: 2030,
    min: 1700,
  },
  published: {
    type: Boolean,
    default: false, //varsayılan değer belirtilir
  },
  comments: [{ message: String }],
  meta: {
    votes: Number,
    favs: Number,
  },
  category: {
    type: String,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("book", BookSchema);
