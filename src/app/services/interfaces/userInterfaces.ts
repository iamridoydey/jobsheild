// Mutation
export interface CreateUser{
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface UpdateUser {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface DeleteUser {
  id: string;
}

// Query
export interface GetUser {
  id?: string;
  email?: string;
  username?: string;
}