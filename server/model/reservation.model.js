import mongoose from 'mongoose'

const reservationSchema = new mongoose.Schema({
  modelId: {type: String, required: true},
  userId:{type: String, required: true},
  quantity: {type: Number, required: true, min: 1},
  expireAt: { type: Date, required: true },
  isCheckout: {type: Boolean, default: false}
});

reservationSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const ReservationModel = mongoose.model("reservations", reservationSchema);

export default ReservationModel
