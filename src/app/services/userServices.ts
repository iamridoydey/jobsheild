/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import User from "@/models/User.model";
import {
  CreateUser,
  DeleteUser,
  GetUser,
  UpdateUser,
} from "./interfaces/userInterfaces";
import dbConnect from "@/lib/db";

export class UserServices {
  //----------------------------------
  //          Mutation
  //----------------------------------
  // Create User
  public static async createUser(payload: CreateUser) {
    try {
      await dbConnect();
      const { username, email, password } = payload;

      // Check if user already exists
      const findByUsername = await User.findOne({ username });
      if (findByUsername) return {};

      const findByEmail = await User.findOne({ email });
      if (findByEmail) return {};

      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with hashed password
      const user = await User.create({ ...payload, password: hashedPassword });

      return user;
    } catch (error: any) {
      console.log("Create User Error: ", error.message);
      return {};
    }
  }

  public static async updateUser(payload: UpdateUser) {
    try {
      await dbConnect();
      const { id, ...updateData } = payload;

      // Check if user exists
      const user = await User.findById(id);
      if (!user) return {};

      // If updating password, hash it before saving
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      return updatedUser;
    } catch (error: any) {
      console.log("Update User Error: ", error.message);
      return {};
    }
  }

  public static async deleteUser(payload: DeleteUser) {
    try {
      await dbConnect();
      const { id } = payload;

      // Check if user exists
      const user = await User.findById(id);
      if (!user) return {};

      // Delete user
      const deletedUser = await User.findByIdAndDelete(id);
      return deletedUser;
    } catch (error: any) {
      console.log("Delete User Error: ", error.message);
      return {};
    }
  }

  //----------------------------------
  //          Query
  //----------------------------------
  public static async getUsers() {
    try {
      await dbConnect();
      return await User.find({});
    } catch (error: any) {
      console.log("Get User Error: ", error.message);
      return {};
    }
  }

  public static async getUser(payload: GetUser) {
    try {
      await dbConnect();

      const { id, email, username } = payload;

      // Find user based on available field
      const user = await User.findOne(
        id ? { _id: id } : email ? { email } : { username }
      );

      if (!user) return {};

      return user;
    } catch (error: any) {
      console.log("Get User Error: ", error.message);
      return {};
    }
  }
}
