const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: String,
  },
});

module.exports = mongoose.model("user", UserSchema);
