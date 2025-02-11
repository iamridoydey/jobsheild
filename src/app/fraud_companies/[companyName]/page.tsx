/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import fallback from "@/public/fallback.svg";
import HrList from "@/components/Fraud_companies_view/HrList";
import { Frauder, ProofData } from "@/lib/interfaces";
import ImportantLinks from "@/components/Fraud_companies_view/ImportantLinks";
import ProofSection from "@/components/Fraud_companies_view/ProofSection";
import { handleUploadImages } from "@/lib/imageOperator";
import FraudProof from "@/components/Fraud_companies_view/FraudProof";
import { useSession } from "next-auth/react";

const FraudCompanyDetailsView = () => {
  const params = useParams();
  const companyName = decodeURIComponent(params?.companyName as string);

  // get the user
  const {data: session} = useSession();
  const userId = session?.user._id;
  const [frauder, setFrauder] = useState<Frauder | null>(null);
  const [proofs, setProofs] = useState<ProofData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isCreatingProof, setIsCreatingProof] = useState(false);

  const handleProofPopup = () => {
    setIsOpen(true);
  };

  const handleCreateProof = async () => {
    if (!frauder || !text || images.length === 0) return;

    setIsCreatingProof(true);

    try {
      const screenshotUrls = await handleUploadImages(images);

      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
              mutation CreateProof($frauderId: ID!, $submittedBy: ID!, $screenshots: [String!]!, $description: String) {
                createProof(frauderId: $frauderId, submittedBy: $submittedBy, screenshots: $screenshots, description: $description) {
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
          variables: {
            frauderId: frauder._id,
            submittedBy: userId, 
            screenshots: screenshotUrls,
            description: text,
          },
        }),
      });

      const { data, errors } = await res.json();

      if (errors) {
        setError(errors[0].message);
      } else {
        // Add the new proof to the state
        setProofs((prevProofs) => [...prevProofs, data.createProof]);
        // Reset the form
        setText("");
        setImages([]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCreatingProof(false);
    }
  };

  useEffect(() => {
    const fetchFrauder = async () => {
      if (!companyName) return;

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/graphql`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `
                query GetFrauder($companyName: String!) {
                  getFrauder(companyName: $companyName) {
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
              variables: { companyName },
            }),
          }
        );

        const { data, errors } = await res.json();

        if (errors) {
          setError(errors[0].message);
        } else {
          setFrauder(data.getFrauder);
          // Fetch proofs after setting the frauder
          fetchProofs(data.getFrauder._id);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchProofs = async (frauderId: string) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/graphql`,
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
              variables: { frauderId },
            }),
          }
        );

        const { data, errors } = await res.json();

        if (errors) {
          setError(errors[0].message);
        } else {
          setProofs(data.getProofs);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchFrauder();
  }, [companyName]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!frauder)
    return <p className="text-center text-red-500">Company not found</p>;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Company Details Section */}
      <section className="mx-auto p-6 bg-red-400 rounded-md">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Logo */}
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-gray-300">
            <Image
              src={frauder.logo || fallback}
              alt={`${frauder.companyName} logo`}
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold">{frauder.companyName}</h1>
        </div>

        {/* HR List */}
        <HrList frauder={frauder} />

        {/* Important Links */}
        <ImportantLinks frauder={frauder} />
      </section>

      {/* Add Proof Section */}
      <section className="proof_section bg-red-400 mt-4">
        <div className="p-4">
          <button
            onClick={handleProofPopup}
            className="w-full proof_popup_btn border-2 rounded-full text-start p-2 font-bold bg-gray-300 hover:bg-gray-400 transition"
          >
            Add Proof
          </button>
        </div>
      </section>

      {/* Fraud Proof Popup */}
      <FraudProof 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        text={text}
        setText={setText}
        images={images}
        setImages={setImages}
        isLoading={isCreatingProof}
        onSubmit={handleCreateProof}
      />

      {/* Proofs Section */}
      <ProofSection proofs={proofs} isLoading={isCreatingProof} />
    </div>
  );
};

export default FraudCompanyDetailsView;
