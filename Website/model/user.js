const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash the password before saving the user
UserSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password') || user.isNew) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
