import mongoose, { Schema } from 'mongoose';

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

delete mongoose.connection.models.Location;
const Location = mongoose.model('Location', schema);

export default Location;
