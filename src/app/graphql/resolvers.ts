import { FraudServices } from "../services/fraudServices";
import { CreateFrauder, DeleteFrauder, GetFrauder, UpdateFrauder } from "../services/interfaces/frauderInterfaces";
import { CreateProof, DeleteProof, GetProof, UpdateProof } from "../services/interfaces/proofInterfaces";
import { CreateUser, DeleteUser, GetUser, UpdateUser } from "../services/interfaces/userInterfaces";
import { ProofServices } from "../services/proofServices";
import { UserServices } from "../services/userServices";
import { VerificationService } from "../services/VerificationServices";

/* eslint-disable @typescript-eslint/no-explicit-any */
const resolvers = {
  Query: {
    getUsers: async () => {
      return await UserServices.getUsers();
    },
    getUser: async (_: any, payload: GetUser) => {
      return await UserServices.getUser(payload);
    },

    getFrauders: async () => {
      return await FraudServices.getFrauders();
    },
    getFrauder: async (_: any, payload: GetFrauder) => {
      return await FraudServices.getFrauder(payload);
    },

    getProofs: async (_: any, payload: GetProof) => {
      return await ProofServices.getProofs(payload);
    },
  },
  Mutation: {
    createUser: async (_: any, payload: CreateUser) => {
      return await UserServices.createUser(payload);
    },
    updateUser: async (_: any, payload: UpdateUser) => {
      return await UserServices.updateUser(payload);
    },
    deleteUser: async (_: any, payload: DeleteUser) => {
      return await UserServices.deleteUser(payload);
    },

    createFrauder: async (_: any, payload: CreateFrauder) => {
      return await FraudServices.createFrauder(payload);
    },
    updateFrauder: async (_: any, payload: UpdateFrauder) => {
      return await FraudServices.updateFrauder(payload);
    },
    deleteFrauder: async (_: any, payload: DeleteFrauder) => {
      return await FraudServices.deleteFrauder(payload);
    },
    createProof: async (_: any, payload: CreateProof) => {
      return await ProofServices.createProof(payload);
    },
    updateProof: async (_: any, payload: UpdateProof) => {
      return await ProofServices.updateProof(payload);
    },
    deleteProof: async (_: any, payload: DeleteProof) => {
      return await ProofServices.deleteProof(payload);
    },
    // Verification
    sendVerificationEmail: async (_: any, { email }: { email: string }) =>
      await VerificationService.sendVerificationEmail(email),

    verifyCode: async (_: any, { email, code }: { email: string, code: any }) =>
      await VerificationService.verifyCode(email, code),
  },
};


export default resolvers;