/* eslint-disable @typescript-eslint/no-explicit-any */
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
      const { username, email } = payload;

      // check whether the user already exists
      const findByUsername = await User.findOne({ username });

      if (findByUsername) return {};

      const findByEmail = await User.findOne({ email });

      if (findByEmail) return {};

      // If the user doesn't exist then add the user to the database
      const user = await User.create(payload);

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

      // check whether the user exists
      const user = await User.findById(id);

      if (!user) return {};

      // If the user exists, update the user
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

      // check whether the user exists
      const user = await User.findById(id);

      if (!user) return {};

      // If the user exists, delete the user
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
      const { id } = payload;
      const user = await User.findById(id);
      if (!user) return {};

      return user;
    } catch (error: any) {
      console.log("Get User Error: ", error.message);
      return {};
    }
  }
}
