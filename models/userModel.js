import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  UUID: String,
  profilepic: String,
  name: String,
  email: String,
  username: String,
  password: String,
  balance: Number,
  firebaseUID: String
});

const User = mongoose.model('User', userSchema);

export default User;
