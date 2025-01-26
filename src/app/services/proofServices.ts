/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import Proof from "@/models/Proof.model";
import Frauder from "@/models/Frauder.model";
import {
  CreateProof,
  DeleteProof,
  GetProof,
  UpdateProof,
} from "./interfaces/proofInterfaces";
import { Types } from "mongoose";

export class ProofServices {
  //----------------------------------
  //          Mutation
  //----------------------------------
  public static async createProof(payload: CreateProof) {
    try {
      await dbConnect();
      const { userId, frauderId } = payload;

      // Check whether the frauder exists
      const frauder = await Frauder.findById(frauderId);

      if (!frauder) return {};

      // Insert a proof
      const proof = await Proof.create(payload);

      // Convert userId to ObjectId
      const userIdObj = new Types.ObjectId(userId);
      // If frauderId exists, add the user as a contributor
      if (!frauder.contributors.includes(userIdObj)) {
        frauder.contributors.push(userIdObj);
      }

      console.log("Contributor ", frauder);
      // add the proof id to the frauder
      if (frauder && frauder.proofs) {
        frauder.proofs.push(proof._id);
      }
      // Save the updated frauder
      await frauder.save();

      return proof;
    } catch (error: any) {
      console.log("Create Proof Error: ", error.message);
      return {};
    }
  }

  public static async updateProof(payload: UpdateProof) {
    try {
      await dbConnect();
      const { id, ...updateData } = payload;

      console.log("payload ", payload);
      // Check whether the proof exists
      const proof = await Proof.findById(id);

      if (!proof) return {};

      // If the proof exists, update the proof
      const updatedProof = await Proof.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      console.log("updated proof ", updatedProof);

      return updatedProof || {};
    } catch (error: any) {
      console.log("Update Proof Error: ", error.message);
      return {};
    }
  }

  public static async deleteProof(payload: DeleteProof) {
    try {
      await dbConnect();
      const { id } = payload;

      console.log("Proof payload ", payload);
      // Convert id to ObjectId
      const proofIdObj = new Types.ObjectId(id);

      // Find and delete the proof
      const proof = await Proof.findByIdAndDelete(id);
      if (!proof) {
        console.log("Proof not found.");
        return {};
      }

      // Find the related frauder
      const frauder = await Frauder.findOne({ proofs: proofIdObj });
      if (frauder) {
        // Remove the proof reference
        frauder.proofs = frauder.proofs.filter(
          (proofId: any) => !proofId.equals(proofIdObj)
        );
        await frauder.save();
        console.log("Updated Frauder:", frauder);
      } else {
        console.log("No frauder associated with the proof.");
      }

      return proof;
    } catch (error: any) {
      console.error("Delete Proof Error:", error.message);
      return {};
    }
  }

  //----------------------------------
  //          Query
  //----------------------------------

  public static async getProofs(payload: GetProof) {
    try {
      await dbConnect();
      console.log("Get proofs ", payload)
      const { frauderId } = payload;
      const proof = await Proof.find({ frauderId });
      console.log("Proof ", proof)
      if (!proof) return {};

      return proof;
    } catch (error: any) {
      console.log("Get Proof Error: ", error.message);
      return {};
    }
  }
}
