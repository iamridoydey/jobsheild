/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: any;
        promise: Promise<any> | null;
      };
    }
  }
}

export {};
