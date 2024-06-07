// const mongoose = require("mongoose");

// const User = mongoose.model(
//     "User",
//     new mongoose.Schema({
//         username: String,
//         email: String,
//         password: String,
//         roles: [
//             {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "Role"
//             }
//         ]
//     })
// );

// module.exports = User;

const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    firstname:{
      type: String,
      required: true
    

    },
    lastname: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Compare the given password with the hashed password in the database
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

//const User = mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);