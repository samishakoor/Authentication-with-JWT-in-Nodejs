const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
  },
  type: {
    type: String,
    enum: ['customer', 'owner'],
    required: true
  },
},{
  toJSON: {
      transform(doc, ret){
          delete ret.password;
          delete ret.type;
          delete ret.createdAt;
          delete ret.updatedAt;
          delete ret.__v;
      }
  },
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
