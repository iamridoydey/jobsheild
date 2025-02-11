/* eslint-disable @typescript-eslint/no-explicit-any */
import { signOut } from "next-auth/react";
import { useState } from "react";

const DeleteAccount = ({
  userId,
  setDeletePopup,
}: {
  userId: string;
  setDeletePopup: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOnDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation DeleteUser($id: ID!){
              deleteUser(id: $id){
                _id
                name
              }
            }
          `,
          variables: { id: userId },
        }),
      });

      const data = await res.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      // Sign out after successful deletion
      await signOut();

      // Redirect to home page
      window.location.href = "/";
    } catch (error: any) {
      setError(error.message || "Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-red-400 p-6 border rounded-xl shadow-md w-full max-w-sm text-center">
        <h4 className="text-xl font-bold text-gray-800">Delete Account</h4>
        <p className="text-gray-700 mt-2">
          Are you sure about deleting your account? This action is
          irreversible.
        </p>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        <div className="mt-4 flex justify-between gap-4">
          <button
            onClick={handleOnDelete}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:bg-gray-500"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => setDeletePopup(false)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
