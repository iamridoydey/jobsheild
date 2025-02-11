export interface URL {
  key: string;
  value: string;
}

export interface HR {
  name: string;
  account: string;
  accountUrl: string;
}

export interface ImportantLink {
  key: string;
  value: string;
}

export interface Frauder {
  _id: string;
  companyName: string;
  logo: string;
  hrList: HR[];
  importantLinks: ImportantLink[];
  createdBy: string;
  contributors: string[];
  isJustified: boolean;
  proofs: string[];
  createdAt: string;
}

export interface ProofData {
  _id: string;
  frauderId: string;
  submittedBy: string;
  screenshots: string[];
  description: string;
  isJustified: boolean;
  createdAt: string;
}