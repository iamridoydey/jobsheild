/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import fallback from "@/public/fallback.svg";
import { Frauder, ProofData } from "@/lib/interfaces";
import Link from "next/link";
import ImagePopup from "@/components/ui/ImagePopup";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const Dashboard = () => {
  const { data: session } = useSession();
  const [frauders, setFrauders] = useState<Frauder[]>([]);
  const [proofs, setProofs] = useState<ProofData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<
    "fraud-companies" | "all-proofs"
  >("fraud-companies");

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?._id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch user data including insertedFrauders
        const userRes = await fetch(
          `/api/graphql`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `
                query GetUser($id: ID!) {
                  getUser(id: $id) {
                    _id
                    insertedFrauders
                  }
                }
              `,
              variables: { id: session.user._id },
            }),
          }
        );

        const { data: userData, errors: userErrors } = await userRes.json();

        if (userErrors) {
          throw new Error(userErrors[0].message);
        }

        const insertedFrauders = userData.getUser.insertedFrauders;

        // Fetch details of each fraud company
        const frauderPromises = insertedFrauders.map(
          async (frauderId: string) => {
            const res = await fetch(
              `/api/graphql`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  query: `
                  query GetFrauder($id: ID!) {
                    getFrauder(id: $id) {
                      _id
                      companyName
                      logo
                      hrList {
                        name
                        account
                        accountUrl
                      }
                      importantLinks {
                        key
                        value
                      }
                    }
                  }
                `,
                  variables: { id: frauderId },
                }),
              }
            );

            const { data, errors } = await res.json();

            if (errors) {
              throw new Error(errors[0].message);
            }

            return data.getFrauder;
          }
        );

        const frauderResults = await Promise.all(frauderPromises);
        setFrauders(frauderResults);

        // Fetch proofs for each fraud company
        const proofPromises = frauderResults.map(async (frauder) => {
          const res = await fetch(
            `/api/graphql`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: `
                  query GetProofs($frauderId: String!) {
                    getProofs(frauderId: $frauderId) {
                      _id
                      frauderId
                      submittedBy
                      screenshots
                      description
                      isJustified
                      createdAt
                    }
                  }
                `,
                variables: { frauderId: frauder._id },
              }),
            }
          );

          const { data, errors } = await res.json();

          if (errors) {
            throw new Error(errors[0].message);
          }

          return data.getProofs;
        });

        const proofResults = await Promise.all(proofPromises);
        setProofs(proofResults.flat());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  const handleImageClick = (images: string[], index: number) => {
    setCurrentImages(images);
    setCurrentIndex(index);
    setIsPopupOpen(true);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="mx-auto max-w-7xl p-4">
      {/* Breadcrumbs */}
      <div className="breadcrumbs mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href={"/"}>Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Select Option */}
      <div className="mb-6">
        <select
          value={selectedOption}
          onChange={(e) =>
            setSelectedOption(
              e.target.value as "fraud-companies" | "all-proofs"
            )
          }
          className="p-2 border rounded-md"
        >
          <option value="fraud-companies">Added Fraud Companies</option>
          <option value="all-proofs">All Proofs</option>
        </select>
      </div>

      {/* Conditional Rendering Based on Selected Option */}
      {selectedOption === "fraud-companies" ? (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Your Added Fraud Companies
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {frauders.map((frauder) => (
              <div
                key={frauder._id}
                className="bg-white p-4 rounded-md shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                    <Image
                      src={frauder.logo || fallback}
                      alt={`${frauder.companyName} logo`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {frauder.companyName}
                  </h3>
                </div>
                <Link
                  href={`/fraud_companies/${encodeURIComponent(
                    frauder.companyName
                  )}`}
                  className="mt-4 inline-block text-blue-500 hover:underline"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section>
          <h2 className="text-xl font-semibold mb-4">All Proofs</h2>
          <div className="space-y-4">
            {proofs.map((proof) => (
              <div
                key={proof._id}
                className="bg-white p-4 rounded-md shadow-md"
              >
                <p className="mb-2">{proof.description}</p>
                <div className="flex flex-wrap gap-2">
                  {proof.screenshots.map((screenshot, index) => (
                    <Image
                      key={index}
                      src={screenshot}
                      alt={`Proof Screenshot ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-md cursor-pointer"
                      width={96}
                      height={96}
                      onClick={() => handleImageClick(proof.screenshots, index)}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Created At: {new Date(proof.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {isPopupOpen && (
        <ImagePopup
          images={currentImages}
          initialIndex={currentIndex}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
