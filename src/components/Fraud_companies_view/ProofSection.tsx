import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ProofData } from "@/lib/interfaces";
import ImagePopup from "../ui/ImagePopup"; // Make sure the path is correct

const getUser = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/graphql`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query GetUser($id: ID!) {
              getUser(id: $id) {
                _id
                username
              }
            }
          `,
          variables: {
            id,
          },
        }),
      }
    );

    const { data, errors } = await response.json();
    if (errors) {
      throw new Error(errors[0].message);
    }
    return data.getUser;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      username: "username",
    };
  }
};

const ProofSection = ({
  proofs,
  isLoading,
}: {
  proofs: ProofData[];
  isLoading: boolean;
}) => {
  const [usernames, setUsernames] = useState<{
    [key: string]: { username: string; avatar: string };
  }>({});
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  useEffect(() => {
    const fetchUsernames = async () => {
      const fetchedUsernames: {
        [key: string]: { username: string; avatar: string };
      } = {};
      for (const proof of proofs) {
        if (!usernames[proof.submittedBy]) {
          const user = await getUser(proof.submittedBy);
          fetchedUsernames[proof.submittedBy] = {
            username: user.username,
            avatar: "/user_avatar.svg",
          };
        }
      }
      setUsernames(fetchedUsernames);
    };

    fetchUsernames();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proofs]);

  const handleImageClick = (images: string[], index: number) => {
    setSelectedImages(images);
    setInitialImageIndex(index);
    setIsPopupOpen(true);
  };

  return (
    <section className="proof_section bg-red-400 mt-4 p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-4">Proofs</h2>
      {isLoading ? (
        <p className="text-center">Loading new proof...</p>
      ) : proofs.length > 0 ? (
        proofs.map((proof) => (
          <div key={proof._id} className="bg-gray-100 p-4 rounded-md mb-4">
            <div className="flex items-center mb-2">
              <Image
                src={usernames[proof.submittedBy]?.avatar || "/user_avatar.svg"}
                alt={`Avatar of ${usernames[proof.submittedBy]?.username}`}
                width={40}
                height={40}
                className="rounded-full mr-2"
              />
              <h3 className="text-lg font-semibold">
                {usernames[proof.submittedBy]?.username}
              </h3>
            </div>
            <p className="mb-2">{proof.description}</p>
            <div className="flex flex-wrap gap-2">
              {proof.screenshots.map((screenshot, index) => (
                <Image
                  key={index}
                  src={screenshot}
                  alt={`Proof Screenshot ${index + 1}`}
                  width={100}
                  height={100}
                  className="rounded-md cursor-pointer"
                  onClick={() => handleImageClick(proof.screenshots, index)}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Created At: {new Date(proof.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-700">No proofs found.</p>
      )}
      {isPopupOpen && (
        <ImagePopup
          images={selectedImages}
          onClose={() => setIsPopupOpen(false)}
          initialIndex={initialImageIndex}
        />
      )}
    </section>
  );
};

export default ProofSection;
