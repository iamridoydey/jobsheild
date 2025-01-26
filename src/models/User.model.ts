import { Schema, model, models } from "mongoose";

// Define the User schema
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user","admin", "moderator"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    insertedFrauders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Frauder"
      }
    ],
  },
  { timestamps: true }
); 

const User = models.User || model("User", UserSchema);

export default User;
