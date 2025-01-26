import { models, Schema, model } from "mongoose";

const hrSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  accountUrl: {
    type: String,
    required: true,
    default: "http://example.com"
  },
});

const linkSchema = new Schema({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const frauderSchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    hrList: {
      type: [hrSchema],
      required: true,
    },
    logo: {
      type: String,
      required: false,
    },
    importantLinks: {
      type: [linkSchema],
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    contributors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    isJustified: {
      type: Boolean,
      default: false,
    },
    proofs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Proof",
      },
    ],
  },
  { timestamps: true }
);

const Frauder = models.Frauder || model("Frauder", frauderSchema);

export default Frauder;
