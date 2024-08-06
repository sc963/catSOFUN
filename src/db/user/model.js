import mongoose, { Schema } from 'mongoose';

const schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

delete mongoose.connection.models.User;
const User = mongoose.model('User', schema);

export default User;
