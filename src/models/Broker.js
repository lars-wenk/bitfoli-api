import mongoose from "mongoose";

const schema = new mongoose.Schema({
  broker: { type: String, required: true },
  apiKey: { type: String, required: true },
  secretKey: { type: String, required: true },
  status: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

export default mongoose.model("Broker", schema);
