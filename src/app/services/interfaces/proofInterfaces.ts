export interface CreateProof {
  userId: string;
  frauderId: string;
  submittedBy: string;
  screenshorts: string[],
  description: string;
  isJustified: boolean;
}

export interface UpdateProof {
  id: string;
  frauderId: string;
  screenshorts: string[];
  description: string;
  isJustified: boolean;
}

export interface DeleteProof {
  id: string;
}

export interface GetProof {
  frauderId: string;
}