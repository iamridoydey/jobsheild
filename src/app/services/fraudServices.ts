/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import Frauder from "@/models/Frauder.model";
import {
  CreateFrauder,
  DeleteFrauder,
  GetFrauder,
  UpdateFrauder,
} from "./interfaces/frauderInterfaces";
import User from "@/models/User.model";
import { Types } from "mongoose";

export class FraudServices {
  //----------------------------------
  //          Mutation
  //----------------------------------
  public static async createFrauder(payload: CreateFrauder) {
    try {
      await dbConnect();
      console.log("Create Frauder ", payload);

      const { companyName, createdBy } = payload;
      // Check whether the user exist or not
      const user = await User.findById(createdBy)
      if (!user) return {};

      // check whether the Frauder already exists
      const findByCompanyName = await Frauder.findOne({ companyName });

      if (findByCompanyName !== null) return {};

      // If the Frauder doesn't exist then add the user to the database
      const frauder = await Frauder.create(payload);

      const frauderObjId = new Types.ObjectId(frauder._id);

      // Add the frauder in the user insertedFrauders
      if(user.insertedFrauders && !user.insertedFrauders.includes(frauderObjId)){
        user.insertedFrauders.push(frauderObjId)
      }

      await user.save()

      return frauder;
    } catch (error: any) {
      console.log("Create Frauder Error: ", error.message);
      return {};
    }
  }

  public static async updateFrauder(payload: UpdateFrauder) {
    try {
      await dbConnect();
      console.log("Payload ", payload);
      const { id, userId, ...updateData } = payload;

      // check whether the Frauder exists
      const frauder = await Frauder.findById(id);

      if (!frauder) return {};

      // If the frauder exists then update the frauder
      // Add the new contributor if not already in the contributors list
      if (!frauder.contributors.includes(userId)) {
        frauder.contributors.push(userId);
      }

      // Update the other fields
      Object.assign(frauder, updateData);

      // Save the updated frauder
      const updatedFrauder = await frauder.save();
      
      console.log("Updated Frauder ", updatedFrauder)

      return updatedFrauder;
    } catch (error: any) {
      console.log("Update Frauder Error: ", error.message);
      return {};
    }
  }

  public static async deleteFrauder(payload: DeleteFrauder) {
    try {
      await dbConnect();
      const { id, userId } = payload;


      const user = await User.findById(userId);
      if (!user) return {};

      // check whether the Frauder exists
      const frauder = await Frauder.findById(id);

      if (!frauder) return {};

      // If the user exists, delete the user
      const deletedFrauder = await Frauder.findByIdAndDelete(id);

      // Remove the items from the user insertedFrauders as well
      if(user.insertedFrauders && user.insertedFrauders.include(deletedFrauder._id)){
        user.insertedFrauders = user.insertedFrauders.filter((user_id: any)=> !user_id.equals(deletedFrauder._id))
      }

      console.log("Deleted Frauder ", deletedFrauder)

      return deletedFrauder;
    } catch (error: any) {
      console.log("Delete Frauder Error: ", error.message);
      return {};
    }
  }

  //----------------------------------
  //          Query
  //----------------------------------
  public static async getFrauders() {
    try {
      await dbConnect();
      const frauders = await Frauder.find({});
      return frauders;
    } catch (error: any) {
      console.log("Get Frauders Error: ", error.message);
      return [];
    }
  }

  public static async getFrauder(payload: GetFrauder) {
    try {
      await dbConnect();
      if (payload.id) return await Frauder.findById(payload.id);
      else if (payload.companyName)
        return await Frauder.findOne({ companyName: payload.companyName });
      else return {};
    } catch (error: any) {
      console.log("Get Frauder Error: ", error.message);
      return {};
    }
  }
}
