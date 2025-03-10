// Mutation
interface HrSchema {
  name: string;
  account: string;
  accountUrl: string;
}

interface Link {
  key: string;
  value: string;
}

export interface CreateFrauder {
  companyName: string;
  hrList: HrSchema[];
  logo?: string;
  importantLinks?: Link[];
  createdBy: string;
}

export interface UpdateFrauder {
  id: string;
  userId: string;
  companyName: string;
  hrList: HrSchema[];
  logo?: string;
  importantLinks?: Link[];
}

export interface DeleteFrauder {
  id: string;
  userId: string;
}

export interface GetFrauder {
  id: string;
  companyName: string;
}
