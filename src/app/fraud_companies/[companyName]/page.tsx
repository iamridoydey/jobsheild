"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import fraudersData from "@/lib/frauders_temp_data";
import fallback from "@/public/fallback.svg";
import Proof from "@/components/ui/Proof";

const FraudCompanyDetailsView = () => {
  const params = useParams();
  const companyName = params?.companyName as string;

  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleProofPopup = ()=>{
    setIsOpen(true)
  }

  if (!companyName) return null;

  // Find the frauder based on companyName
  const frauder = fraudersData.find(
    (f) => f.companyName === decodeURIComponent(companyName)
  );

  if (!frauder)
    return <p className="text-center text-red-500">Company not found</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <section className=" mx-auto p-6 bg-red-400 rounded-md">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <figure className="max-w-24 max-h-24 overflow-hidden rounded-full border border-gray-300">
            <Image
              src={fallback}
              alt={`${frauder?.companyName || "Company"} logo`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </figure>

          <h1 className="text-2xl font-bold">{frauder.companyName}</h1>
        </div>

        {/* HR List */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">HR Contacts</h2>
          <ul className="mt-2 space-y-2">
            {frauder.hrList?.map((hr, index) => (
              <li key={index} className="bg-gray-100 p-3 rounded">
                <p className="font-medium">{hr.name}</p>
                <a
                  href={hr.accountUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  {hr.account}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Important Links */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Important Links</h2>
          <ul className="mt-2 space-y-2">
            {frauder.importantLinks?.map((link, index) => (
              <li key={index} className="bg-gray-100 p-3 rounded">
                <span className="font-medium">{link.key}: </span>
                <a
                  href={link.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  {link.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="proof_section bg-red-400 mt-4">
        {/* Add New Proof */}
        <div className="p-4">
          <button onClick={handleProofPopup} className="w-full proof_popup_btn border-[2px] rounded-full text-start p-2 font-bold bg-gray-300">
            Add Proof
          </button>
          {/* Add proof popup */}
          <Proof
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            text={text}
            setText={setText}
            images={images}
            setImages={setImages}
          />
        </div>
      </section>
    </div>
  );
};

export default FraudCompanyDetailsView;
