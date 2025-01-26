import { model, models, Schema } from "mongoose";

const proofSchema = new Schema({
  frauderId: {
    type: Schema.Types.ObjectId,
    ref: "Frauder",
    required: true
  },
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: false
  },
  screenshots: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: ""
  },
  isJustified: {
    type: Boolean,
    default: false
  }
}, {timestamps: true})

const Proof = models.Proof || model("Proof", proofSchema)
export default Proof;