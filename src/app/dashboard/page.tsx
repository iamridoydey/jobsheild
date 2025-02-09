/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { gql, useQuery } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      _id
      name
      email
    }
  }
`;

const Dashboard = () => {
  const { loading, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {data?.getUsers.map((user: any) => (
          <li key={user._id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
