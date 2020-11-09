const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  user_id: {
    type: String, //type:mongoose.Schema.Types.ObjectId
  },
  title: {
    type: String,
    required: true,
    unique: true,
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
